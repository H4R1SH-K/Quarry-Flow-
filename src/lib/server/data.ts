
import { getFirebaseApp } from '@/lib/firebase';
import { getFirestore, doc, getDoc, collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import type { Profile, Sales, Customer, Vehicle, Expense, Reminder } from '@/lib/types';
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

// Profile functions
export async function getProfile(): Promise<Profile | null> {
    const db = await getDb();
    if (!db) return null;
    
    const docRef = doc(db, 'profile', 'user_profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Profile;
    }
    return null;
}

// In a real application, this would fetch data from a database or API.
// For this local-first app, we'll return mock data on the server
// as server components cannot access localStorage.
// The client-side components will use the real data from the Zustand store.

export async function getDashboardData(): Promise<{
  sales: Sales[];
  customers: Customer[];
  vehicles: Vehicle[];
  expenses: Expense[];
  reminders: Reminder[];
}> {
  const db = await getDb();
  if (!db) {
    // Fallback to sample data if firebase is not configured
    return initialState;
  }

  // This is a server-side fetch. We are not using the client-side store here.
  // We can fetch directly from firestore.
  try {
    const salesSnap = await getDocs(query(collection(db, "sales"), orderBy("date", "desc"), limit(50)));
    const customersSnap = await getDocs(query(collection(db, "customers"), limit(50)));
    const vehiclesSnap = await getDocs(query(collection(db, "vehicles"), limit(50)));
    const expensesSnap = await getDocs(query(collection(db, "expenses"), limit(50)));
    const remindersSnap = await getDocs(query(collection(db, "reminders"), limit(50)));

    return {
      sales: salesSnap.docs.map(d => ({...d.data(), id: d.id})) as Sales[],
      customers: customersSnap.docs.map(d => ({...d.data(), id: d.id})) as Customer[],
      vehicles: vehiclesSnap.docs.map(d => ({...d.data(), id: d.id})) as Vehicle[],
      expenses: expensesSnap.docs.map(d => ({...d.data(), id: d.id})) as Expense[],
      reminders: remindersSnap.docs.map(d => ({...d.data(), id: d.id})) as Reminder[],
    };

  } catch (e) {
    console.error("Could not fetch dashboard data from server. Falling back to sample data.", e);
    // Fallback to sample data if there's a firebase error
    return initialState;
  }
}
