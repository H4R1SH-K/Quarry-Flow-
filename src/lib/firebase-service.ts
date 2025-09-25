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
  enableIndexedDbPersistence,
  type Firestore
} from 'firebase/firestore';
import type { Customer, Sales, Vehicle, Expense, Reminder, Profile } from '@/lib/types';

let db: Firestore | null = null;
let persistenceEnabled = false;

// This function initializes Firestore for the CLIENT-SIDE ONLY with persistence.
async function getDb(): Promise<Firestore> {
  if (db && persistenceEnabled) {
    return db;
  }

  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured. Please add your Firebase configuration.");
  }
  
  db = getFirestore(app);

  if (!persistenceEnabled) {
    try {
        await enableIndexedDbPersistence(db);
        persistenceEnabled = true;
    } catch (err: any) {
        if (err.code === 'failed-precondition') {
            console.warn("Firestore persistence failed to initialize. Multiple tabs open?");
        } else if (err.code === 'unimplemented') {
            console.warn("Firestore persistence is not available in this browser.");
        }
    }
  }
  
  return db;
}


// Generic function to get all documents from a collection, with a default limit.
async function getCollection<T>(collectionName: string, recordLimit: number = 100): Promise<T[]> {
  const db = await getDb();
  const q = query(collection(db, collectionName), orderBy('id', 'desc'), limit(recordLimit));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

// Generic function to add or update a document
async function setDocument<T extends { id: string }>(collectionName: string, item: T): Promise<void> {
  const db = await getDb();
  const docRef = doc(db, collectionName, item.id);
  await setDoc(docRef, item, { merge: true });
}

// Generic function to delete a document
async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const db = await getDb();
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
    const db = await getDb();
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
    const db = await getDb();
    const docRef = doc(db, 'profile', 'user_profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Profile;
    }
    return null;
}
export async function saveProfile(profile: Profile): Promise<void> {
    const db = await getDb();
    const docRef = doc(db, 'profile', 'user_profile');
    await setDoc(docRef, profile);
}
