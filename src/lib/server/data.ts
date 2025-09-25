
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
    
    // The try/catch block is moved to the main getDashboardData function
    // to handle fallbacks at a global level.
    const snap = await getDocs(query(collection(db, collectionName), orderBy("id", "desc")));
    if (snap.empty) {
      return [];
    }
    return snap.docs.map(d => ({ ...d.data(), id: d.id })) as T[];
}

export async function getProfile(): Promise<Profile | null> {
    const db = await getDb();
    if (!db) return initialState.profile;
    
    // The try/catch block is moved to the main getDashboardData function
    const docRef = doc(db, 'profile', 'user_profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Profile;
    }
    return initialState.profile; // Fallback to sample if no profile exists
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
  const db = await getDb();
  if (!db) {
    return {...initialState, profile: initialState.profile, error: 'FIREBASE_NOT_CONFIGURED'};
  }

  try {
    const [sales, customers, vehicles, expenses, reminders, profile] = await Promise.all([
        getSales(),
        getCustomers(),
        getVehicles(),
        getExpenses(),
        getReminders(),
        getProfile(),
    ]);

    // Check if the database is truly empty to decide whether to show sample data.
    // This is useful for first-time users.
    const isDbEmpty = sales.length === 0 && customers.length === 0 && vehicles.length === 0 && expenses.length === 0 && reminders.length === 0;

    if (isDbEmpty) {
      console.log('Database is empty, returning initial empty state.');
      return {...initialState, profile: initialState.profile, error: null};
    }
    
    return { sales, customers, vehicles, expenses, reminders, profile, error: null };

  } catch (e: any) {
    let errorType = 'UNKNOWN_ERROR';
    // This is the global catch block that prevents any page from crashing.
    if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
        console.warn(`Firestore permission/connection error detected. Falling back to initial data for the entire app.`);
        errorType = 'PERMISSION_DENIED';
    } else {
        console.error("Could not fetch dashboard data from server.", e);
    }
    
    // Fallback to the initial (empty) state for the whole app if there's any firebase error.
    return {...initialState, profile: initialState.profile, error: errorType};
  }
}
