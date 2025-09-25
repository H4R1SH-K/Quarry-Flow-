
import { getFirebaseApp } from '@/lib/firebase';
import { getFirestore, doc, getDoc, collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import type { Profile, Sales, Customer, Vehicle, Expense, Reminder, AuditLog } from '@/lib/types';
import { initialState } from '@/lib/sample-data';


async function getDb() {
  const app = getFirebaseApp();
  // On the server, we don't need persistence. We want a direct connection.
  // We initialize a new instance for each server-side request context if needed.
  if (!app) {
    return null;
  }
  return getFirestore(app);
}

async function fetchCollection<T>(collectionName: keyof typeof initialState | 'profile' | 'auditLogs'): Promise<T[]> {
    const db = await getDb();
    if (!db) {
        // @ts-ignore
        return initialState[collectionName] || [];
    }
    try {
        const snap = await getDocs(query(collection(db, collectionName), orderBy("id", "desc"), limit(100)));
        if (snap.empty) {
          // If the collection is empty in Firestore, return the sample data for it
          // @ts-ignore
          return initialState[collectionName] || [];
        }
        return snap.docs.map(d => ({ ...d.data(), id: d.id })) as T[];
    } catch(e: any) {
        if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
            console.warn(`Firestore permission/connection error for ${collectionName}. Falling back to sample data.`);
            // @ts-ignore
            return initialState[collectionName] || [];
        }
        console.error(`Failed to fetch ${collectionName}`, e);
        // Fallback to sample data on any other error as well
        // @ts-ignore
        return initialState[collectionName] || [];
    }
}

// Profile functions
export async function getProfile(): Promise<Profile | null> {
    const db = await getDb();
    if (!db) return initialState.profile;
    
    try {
        const docRef = doc(db, 'profile', 'user_profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as Profile;
        }
        return sampleData.profile;
    } catch(e: any) {
        if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
             console.warn(`Firestore permission/connection error for profile. Falling back to sample data.`);
             return sampleData.profile;
        }
        console.error(`Failed to fetch profile`, e);
        return sampleData.profile;
    }
}

// Functions to fetch data for each page
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
    // Fallback to sample data if firebase is not configured
    return {...initialState, profile: sampleData.profile, error: 'FIREBASE_NOT_CONFIGURED'};
  }

  // This is a server-side fetch. We are not using the client-side store here.
  // We can fetch directly from firestore.
  try {
    const [sales, customers, vehicles, expenses, reminders] = await Promise.all([
        getSales(),
        getCustomers(),
        getVehicles(),
        getExpenses(),
        getReminders(),
    ]);

    // If any of the fetches returned sample data (because of an empty DB), 
    // we want to return a consistent set of sample data.
    if (sales.length === 0 && customers.length === 0 && vehicles.length === 0 && expenses.length === 0 && reminders.length === 0) {
      return {...initialState, profile: sampleData.profile, error: null};
    }
    
    return { sales, customers, vehicles, expenses, reminders, error: null };

  } catch (e: any) {
    console.error("Could not fetch dashboard data from server. This should not be reached due to individual fallbacks.", e);
    
    let errorType = 'UNKNOWN_ERROR';
    if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
        errorType = 'PERMISSION_DENIED';
    }

    // Fallback to sample data if there's a firebase error
    return {...initialState, profile: sampleData.profile, error: errorType};
  }
}
