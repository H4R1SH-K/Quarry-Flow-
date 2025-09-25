import { getFirestore, doc, getDoc, collection, getDocs, query, type Firestore, limit } from 'firebase/firestore';
import type { Profile, Sales, Customer, Vehicle, Expense, Reminder, AuditLog } from '@/lib/types';
import { initialState } from '@/lib/sample-data';
import { getFirebaseApp } from '../firebase';


// This function is intended for SERVER-SIDE use only. It does not enable persistence.
function getDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  // This is the correct way to get a Firestore instance for server-side operations.
  // It does NOT use persistence.
  return getFirestore(app);
}


async function fetchCollection<T>(db: Firestore, collectionName: keyof typeof initialState | 'profile' | 'auditLogs'): Promise<T[]> {
  const snap = await getDocs(query(collection(db, collectionName)));
  if (snap.empty) {
    // @ts-ignore
    return initialState[collectionName] || [];
  }
  return snap.docs.map(d => ({ ...d.data(), id: d.id })) as T[];
}

export async function getProfile(db: Firestore): Promise<Profile | null> {
    const docRef = doc(db, 'profile', 'user_profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Profile;
    }
    return initialState.profile; 
}

export const getCustomers = (db: Firestore) => fetchCollection<Customer>(db, 'customers');
export const getSales = (db: Firestore) => fetchCollection<Sales>(db, 'sales');
export const getVehicles = (db: Firestore) => fetchCollection<Vehicle>(db, 'vehicles');
export const getExpenses = (db: Firestore) => fetchCollection<Expense>(db, 'expenses');
export const getReminders = (db: Firestore) => fetchCollection<Reminder>(db, 'reminders');
export const getAuditLogs = (db: Firestore) => fetchCollection<AuditLog>(db, 'auditLogs');


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
  const db = getDb();
  if (!db) {
    return {...initialState, profile: initialState.profile, error: 'FIREBASE_NOT_CONFIGURED'};
  }
  
  try {
    // This is a check to see if Firestore is enabled. It's a lightweight operation.
    // If it fails, we fall back to sample data.
    await getDocs(query(collection(db, 'customers'), limit(1)));

    const [sales, customers, vehicles, expenses, reminders, profile] = await Promise.all([
        getSales(db),
        getCustomers(db),
        getVehicles(db),
        getExpenses(db),
        getReminders(db),
        getProfile(db),
    ]);
    
    return { sales, customers, vehicles, expenses, reminders, profile, error: null };

  } catch (e: any) {
    let errorType = 'UNKNOWN_ERROR';
    if (e.code === 'permission-denied' || e.code === 'failed-precondition' || e.code === 'unimplemented') {
        console.warn(`Firestore connection error on server. Falling back to initial data. Error: ${e.code}`);
        errorType = 'PERMISSION_DENIED';
    } else {
        console.error("Could not fetch dashboard data from server.", e);
    }
    
    return {...initialState, profile: initialState.profile, error: errorType};
  }
}
