
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

// This function now throws on permission errors so a central handler can catch it.
async function fetchCollection<T>(collectionName: keyof typeof initialState | 'profile' | 'auditLogs'): Promise<T[]> {
    const db = await getDb();
    if (!db) {
        // @ts-ignore
        return initialState[collectionName] || [];
    }
    
    const snap = await getDocs(query(collection(db, collectionName), orderBy("id", "desc"), limit(100)));
    if (snap.empty) {
      // @ts-ignore
      return initialState[collectionName] || [];
    }
    return snap.docs.map(d => ({ ...d.data(), id: d.id })) as T[];
}

// Profile functions
export async function getProfile(): Promise<Profile | null> {
    const db = await getDb();
    if (!db) return initialState.profile;
    
    const docRef = doc(db, 'profile', 'user_profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Profile;
    }
    return sampleData.profile;
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

  try {
    const [sales, customers, vehicles, expenses, reminders] = await Promise.all([
        getSales(),
        getCustomers(),
        getVehicles(),
        getExpenses(),
        getReminders(),
    ]);

    // If all fetches succeeded but returned empty arrays, it means the DB is empty.
    // In this case, we use sample data to populate the UI for the user.
    const isDbEmpty = sales.length === 0 && customers.length === 0 && vehicles.length === 0 && expenses.length === 0 && reminders.length === 0;

    if (isDbEmpty) {
      return {...initialState, error: null};
    }
    
    return { sales, customers, vehicles, expenses, reminders, error: null };

  } catch (e: any) {
    let errorType = 'UNKNOWN_ERROR';
    if (e.code === 'permission-denied' || e.code === 'failed-precondition') {
        console.warn(`Firestore permission/connection error. Falling back to sample data.`);
        errorType = 'PERMISSION_DENIED';
    } else {
        console.error("Could not fetch dashboard data from server.", e);
    }
    
    // Fallback to sample data if there's any firebase error during the fetch.
    return {...initialState, error: errorType};
  }
}
