// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, writeBatch, getDocs, doc } from "firebase/firestore";
import type { DataState } from "./data-store";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const COLLECTIONS = {
    CUSTOMERS: 'customers',
    SALES: 'sales',
    VEHICLES: 'vehicles',
    EXPENSES: 'expenses',
    REMINDERS: 'reminders',
};

type DataKeys = 'sales' | 'customers' | 'vehicles' | 'expenses' | 'reminders';


const validateData = (data: any): data is Partial<DataState> => {
    const requiredKeys: DataKeys[] = ['sales', 'customers', 'vehicles', 'expenses', 'reminders'];
    return requiredKeys.every(key => Array.isArray(data[key]));
}


export const migrateToFirestore = async (data: Partial<DataState>) => {
    if (!validateData(data)) {
        throw new Error("Invalid data structure for migration.");
    }
    const batch = writeBatch(db);

    for (const key in data) {
        const collectionName = COLLECTIONS[key.toUpperCase() as keyof typeof COLLECTIONS];
        if (collectionName) {
            const items = data[key as DataKeys] as any[];
            items.forEach(item => {
                const docRef = doc(db, collectionName, item.id);
                batch.set(docRef, item);
            });
        }
    }

    await batch.commit();
}


export const importToFirestore = async (data: Partial<DataState>) => {
    if (!validateData(data)) {
        throw new Error("Invalid data structure for import.");
    }
    const batch = writeBatch(db);

     for (const key in data) {
        const collectionName = COLLECTIONS[key.toUpperCase() as keyof typeof COLLECTIONS];
        if (collectionName) {
            const remoteDocs = await getDocs(collection(db, collectionName));
            const remoteIds = new Set(remoteDocs.docs.map(d => d.id));
            
            const items = data[key as DataKeys] as any[];
            items.forEach(item => {
                if (!remoteIds.has(item.id)) {
                    const docRef = doc(db, collectionName, item.id);
                    batch.set(docRef, item);
                }
            });
        }
    }

    await batch.commit();
}

export { db, COLLECTIONS };
