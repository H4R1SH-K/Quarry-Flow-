
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { Profile, Sales, Customer, Vehicle, Expense, Reminder, AuditLog } from '@/lib/types';
import { initialState } from '@/lib/sample-data';
import { getFirebaseApp } from '../firebase';


async function getDb() {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  // This is the correct way to get a Firestore instance for server-side operations.
  return getFirestore(app);
}


async function fetchCollection<T>(collectionName: keyof typeof initialState | 'profile' | 'auditLogs'): Promise<T[]> {
    const db = await getDb();
    if (!db) {
        // @ts-ignore
        return initialState[collectionName] || [];
    }
    
    try {
        const snap = await getDocs(query(collection(db, collectionName)));
        if (snap.empty) {
          return [];
        }
        return snap.docs.map(d => ({ ...d.data(), id: d.id })) as T[];

    } catch (e: any) {
         if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
            console.warn(`Firestore permission error on server for collection: ${collectionName}. Falling back to sample data.`);
            // @ts-ignore
            return initialState[collectionName] || [];
        }
        throw e;
    }
}

export async function getProfile(): Promise<Profile | null> {
    const db = await getDb();
    if (!db) return initialState.profile;
    
    try {
        const docRef = doc(db, 'profile', 'user_profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as Profile;
        }
        return initialState.profile; 
    } catch(e: any) {
        if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
            console.warn(`Firestore permission error on server for profile. Falling back to sample data.`);
            return initialState.profile;
        }
        throw e;
    }
}

export const getCustomers = async () => fetchCollection<Customer>('customers');
export const getSales = async () => fetchCollection<Sales>('sales');
export const getVehicles = async () => fetchCollection<Vehicle>('vehicles');
export const getExpenses = async () => fetchCollection<Expense>('expenses');
export const getReminders = async () => fetchCollection<Reminder>('reminders');
export const getAuditLogs = async () => fetchCollection<AuditLog>('auditLogs');


type DashboardData = {
  sales: Sales[];
  customers: Customer[];
  vehicles: Vehicle[];
  expenses: Expense[];
  reminders: Reminder[];
  profile: Profile | null;
  error?: string | null;
};


export async function getDashboardData(): Promise<DashboardData> {
  try {
    // We try to fetch just one collection to detect the permission error.
    // The individual functions will handle their own fallbacks.
    const db = await getDb();
    if (db) {
        await getDocs(query(collection(db, 'customers'), limit(1)));
    }
    
    const [sales, customers, vehicles, expenses, reminders, profile] = await Promise.all([
        getSales(),
        getCustomers(),
        getVehicles(),
        getExpenses(),
        getReminders(),
        getProfile(),
    ]);

    const isDbEmpty = sales.length === 0 && customers.length === 0 && vehicles.length === 0 && expenses.length === 0 && reminders.length === 0;

    if (isDbEmpty) {
      console.log('Database is empty, returning initial empty state.');
      return {...initialState, profile: initialState.profile, error: null};
    }
    
    return { sales, customers, vehicles, expenses, reminders, profile, error: null };

  } catch (e: any) {
    let errorType = 'UNKNOWN_ERROR';
    if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
        console.warn(`Firestore permission/connection error detected. Falling back to initial data for the entire app.`);
        errorType = 'PERMISSION_DENIED';
    } else {
        console.error("Could not fetch dashboard data from server.", e);
    }
    
    return {...initialState, profile: initialState.profile, error: errorType};
  }
}
