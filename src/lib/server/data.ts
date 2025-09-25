
import { getFirebaseApp } from '@/lib/firebase';
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { Profile, Sales, Customer, Vehicle, Expense, Reminder, AuditLog } from '@/lib/types';
import { initialState } from '@/lib/sample-data';


async function getDb() {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  // This is the correct way to get a Firestore instance for server-side operations.
  // It does not involve client-side persistence features.
  return getFirestore(app);
}


async function fetchCollection<T>(collectionName: keyof typeof initialState | 'profile' | 'auditLogs'): Promise<T[]> {
    const db = await getDb();
    if (!db) {
        // @ts-ignore
        return initialState[collectionName] || [];
    }
    
    try {
        const snap = await getDocs(query(collection(db, collectionName), orderBy("id", "desc")));
        if (snap.empty) {
          // If the collection is empty in Firestore, return an empty array.
          return [];
        }
        return snap.docs.map(d => ({ ...d.data(), id: d.id })) as T[];
    } catch (e: any) {
        if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
            console.warn(`Firestore permission error fetching '${collectionName}'. A fallback will be used.`);
            // Throw the error so the higher-level function can decide on a fallback strategy.
            throw e;
        }
        // Re-throw other unexpected errors
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
        return initialState.profile; // Fallback to sample if no profile exists
    } catch (e: any) {
         if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
            console.warn(`Firestore permission error fetching 'profile'. Falling back to sample data.`);
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
  error?: string | null;
};


export async function getDashboardData(): Promise<DashboardData> {
  const db = await getDb();
  if (!db) {
    return {...initialState, error: 'FIREBASE_NOT_CONFIGURED'};
  }

  try {
    const [sales, customers, vehicles, expenses, reminders] = await Promise.all([
        getSales(),
        getCustomers(),
        getVehicles(),
        getExpenses(),
        getReminders(),
    ]);

    // This logic correctly handles using sample data only when the database is truly empty,
    // which is useful for first-time users.
    const isDbEmpty = sales.length === 0 && customers.length === 0 && vehicles.length === 0 && expenses.length === 0 && reminders.length === 0;

    if (isDbEmpty) {
      console.log('Database is empty, falling back to sample data for initial view.');
      return {...initialState, error: null};
    }
    
    return { sales, customers, vehicles, expenses, reminders, error: null };

  } catch (e: any) {
    let errorType = 'UNKNOWN_ERROR';
    if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
        console.warn(`Firestore permission/connection error. Falling back to sample data for the entire app.`);
        errorType = 'PERMISSION_DENIED';
    } else {
        console.error("Could not fetch dashboard data from server.", e);
    }
    
    // Fallback to sample data for the whole app if there's any firebase error during the fetch.
    return {...initialState, error: errorType};
  }
}
