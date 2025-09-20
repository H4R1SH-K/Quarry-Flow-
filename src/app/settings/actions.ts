'use server';
import { getFirestore, collection, writeBatch, getDocs, doc } from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase";
import type { DataState } from "@/lib/data-store";

const db = getFirestore(getFirebaseApp());

const COLLECTIONS = {
    CUSTOMERS: 'customers',
    SALES: 'sales',
    VEHICLES: 'vehicles',
    EXPENSES: 'expenses',
    REMINDERS: 'reminders',
};

type DataKeys = 'sales' | 'customers' | 'vehicles' | 'expenses' | 'reminders';


const validateData = (data: any): data is Partial<DataState> => {
    if (!data) return false;
    const requiredKeys: DataKeys[] = ['sales', 'customers', 'vehicles', 'expenses', 'reminders'];
    return requiredKeys.every(key => data[key] === undefined || Array.isArray(data[key]));
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
            if(items) {
                items.forEach(item => {
                    if(item.id) {
                        const docRef = doc(db, collectionName, item.id);
                        batch.set(docRef, item);
                    }
                });
            }
        }
    }

    await batch.commit();
}


export const importToFirestore = async (data: Partial<DataState>) => {
    if (!validateData(data)) {
        throw new Error("Invalid data structure for import. The file must contain arrays for keys like 'sales', 'customers', etc.");
    }
    const batch = writeBatch(db);

     for (const key in data) {
        const collectionName = COLLECTIONS[key.toUpperCase() as keyof typeof COLLECTIONS];
        if (collectionName) {
            const remoteDocs = await getDocs(collection(db, collectionName));
            const remoteIds = new Set(remoteDocs.docs.map(d => d.id));
            
            const items = data[key as DataKeys] as any[];
            if (items) {
                items.forEach(item => {
                    if (item.id && !remoteIds.has(item.id)) {
                        const docRef = doc(db, collectionName, item.id);
                        batch.set(docRef, item);
                    }
                });
            }
        }
    }

    await batch.commit();
}
