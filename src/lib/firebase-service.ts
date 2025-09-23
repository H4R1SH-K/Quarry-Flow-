
'use client';
import { getFirebaseApp } from '@/lib/firebase';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  query,
  limit,
  orderBy,
  getDoc,
  initializeFirestore,
  persistentLocalCache,
  memoryLocalCache,
  Firestore
} from 'firebase/firestore';
import type { Customer, Sales, Vehicle, Expense, Reminder, Profile } from '@/lib/types';

let db: Firestore;

// Singleton pattern to initialize Firestore correctly for client/server
function getDb(): Firestore {
  if (!db) {
    const app = getFirebaseApp();
    if (!app) {
      // This is a fallback for environments without Firebase, like unit tests.
      // It won't have persistence, but it prevents the app from crashing.
      console.error("Firebase is not configured; using in-memory Firestore instance.");
      // To prevent crashes, we can't return a promise or throw here in a way that
      // would break every data-fetching function. We return a non-persistent instance.
      return initializeFirestore(app || {}, { localCache: memoryLocalCache({}) });
    }
    
    // Initialize with the correct cache for the environment.
    // This runs only once.
    db = initializeFirestore(app, {
      localCache: typeof window !== 'undefined' 
        ? persistentLocalCache({}) 
        : memoryLocalCache({})
    });
  }
  return db;
}


// Generic function to get all documents from a collection
async function getCollection<T>(collectionName: string, recordLimit: number = 50): Promise<T[]> {
  const db = getDb();
  const q = query(collection(db, collectionName), limit(recordLimit));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

// Generic function to add or update a document
async function setDocument<T extends { id: string }>(collectionName: string, item: T): Promise<void> {
  const db = getDb();
  const docRef = doc(db, collectionName, item.id);
  await setDoc(docRef, item, { merge: true });
}

// Generic function to delete a document
async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, collectionName, id));
}

// Customer functions
export async function getCustomers(): Promise<Customer[]> {
  return getCollection<Customer>('customers');
}
export async function saveCustomer(customer: Customer): Promise<void> {
  return setDocument('customers', customer);
}
export async function deleteCustomerById(id: string): Promise<void> {
  return deleteDocument('customers', id);
}

// Sales functions
export async function getSales(): Promise<Sales[]> {
    return getCollection<Sales>('sales');
}
export async function getRecentSales(count: number = 5): Promise<Sales[]> {
    const db = getDb();
    const salesCollection = collection(db, 'sales');
    const q = query(salesCollection, orderBy('date', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sales));
};
export async function saveSale(sale: Sales): Promise<void> {
    return setDocument('sales', sale);
}
export async function deleteSaleById(id: string): Promise<void> {
    return deleteDocument('sales', id);
}


// Vehicle functions
export async function getVehicles(): Promise<Vehicle[]> {
    return getCollection<Vehicle>('vehicles');
}
export async function saveVehicle(vehicle: Vehicle): Promise<void> {
    return setDocument('vehicles', vehicle);
}
export async function deleteVehicleById(id: string): Promise<void> {
    return deleteDocument('vehicles', id);
}

// Expense functions
export async function getExpenses(): Promise<Expense[]> {
    return getCollection<Expense>('expenses');
}
export async function saveExpense(expense: Expense): Promise<void> {
    return setDocument('expenses', expense);
}
export async function deleteExpenseById(id: string): Promise<void> {
    return deleteDocument('expenses', id);
}


// Reminder functions
export async function getReminders(): Promise<Reminder[]> {
    return getCollection<Reminder>('reminders');
}
export async function saveReminder(reminder: Reminder): Promise<void> {
    return setDocument('reminders', reminder);
}
export async function deleteReminderById(id: string): Promise<void> {
    return deleteDocument('reminders', id);
}

// Profile functions
export async function getProfile(): Promise<Profile | null> {
    const db = getDb();
    const docRef = doc(db, 'profile', 'user_profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Profile;
    }
    return null;
}
export async function saveProfile(profile: Profile): Promise<void> {
    const db = getDb();
    const docRef = doc(db, 'profile', 'user_profile');
    await setDoc(docRef, profile);
}
