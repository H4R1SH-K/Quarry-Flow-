
'use server';

import { getFirebaseApp } from '@/lib/firebase';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  writeBatch,
  query,
  where,
  limit,
  orderBy
} from 'firebase/firestore';
import type { Customer, Sales, Vehicle, Expense, Reminder, Profile } from './types';

const getDb = () => {
    const app = getFirebaseApp();
    if (!app) {
        throw new Error("Firebase is not configured. Please add your Firebase configuration to enable cloud features.");
    }
    return getFirestore(app);
}

// Generic function to get all documents from a collection
async function getCollection<T>(collectionName: string): Promise<T[]> {
  const db = getDb();
  const q = collection(db, collectionName);
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
export const getCustomers = () => getCollection<Customer>('customers');
export const saveCustomer = (customer: Customer) => setDocument('customers', customer);
export const deleteCustomerById = (id: string) => deleteDocument('customers', id);

// Sales functions
export const getSales = () => getCollection<Sales>('sales');
export const getRecentSales = async (count: number = 5): Promise<Sales[]> => {
    const db = getDb();
    const salesCollection = collection(db, 'sales');
    const q = query(salesCollection, orderBy('date', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sales));
};
export const saveSale = (sale: Sales) => setDocument('sales', sale);
export const deleteSaleById = (id: string) => deleteDocument('sales', id);


// Vehicle functions
export const getVehicles = () => getCollection<Vehicle>('vehicles');
export const saveVehicle = (vehicle: Vehicle) => setDocument('vehicles', vehicle);
export const deleteVehicleById = (id: string) => deleteDocument('vehicles', id);

// Expense functions
export const getExpenses = () => getCollection<Expense>('expenses');
export const saveExpense = (expense: Expense) => setDocument('expenses', expense);
export const deleteExpenseById = (id: string) => deleteDocument('expenses', id);


// Reminder functions
export const getReminders = () => getCollection<Reminder>('reminders');
export const saveReminder = (reminder: Reminder) => setDocument('reminders', reminder);
export const deleteReminderById = (id: string) => deleteDocument('reminders', id);

// Profile functions
export const getProfile = async (): Promise<Profile | null> => {
    // For simplicity, assuming one profile doc with a known ID
    const db = getDb();
    const docRef = doc(db, 'profile', 'user_profile');
    const docSnap = await import('firebase/firestore').then(mod => mod.getDoc(docRef));
    if (docSnap.exists()) {
        return docSnap.data() as Profile;
    }
    return null;
}
export const saveProfile = (profile: Profile) => setDocument('profile', { id: 'user_profile', ...profile });

