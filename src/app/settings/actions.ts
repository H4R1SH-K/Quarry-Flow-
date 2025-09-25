
'use server';
import { getFirestore, collection, writeBatch, getDocs, doc, getDoc } from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase";
import type { DataState } from "@/lib/data-store";

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
    // Loosen validation to allow for backups that might not have all keys
    return typeof data === 'object';
}


export const getFirestoreData = async () => {
    try {
        const app = getFirebaseApp();
        if (!app) {
            return { success: false, message: "Firebase is not configured." };
        }
        const db = getFirestore(app);
        
        const data: Partial<DataState> = {};

        for (const key of Object.values(COLLECTIONS)) {
            const querySnapshot = await getDocs(collection(db, key));
            // @ts-ignore
            data[key as DataKeys] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        // Handle profile separately as it's a single doc
        const profileDoc = await getDoc(doc(db, 'profile', 'user_profile'));
        if (profileDoc.exists()) {
            data.profile = profileDoc.data();
        }

        return { success: true, data };
    } catch (error: any) {
        console.error('Cloud Backup Error:', error);
        return { success: false, message: error.message || 'Could not get data from the cloud.' };
    }
}


export const importToFirestore = async (data: Partial<DataState>) => {
     try {
        const app = getFirebaseApp();
        if (!app) {
             return { success: false, message: "Firebase is not configured. Please add your Firebase configuration to enable cloud features." };
        }
        const db = getFirestore(app);

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
            } else if (key === 'profile' && data.profile) {
                const docRef = doc(db, 'profile', 'user_profile');
                batch.set(docRef, data.profile, { merge: true });
            }
        }

        await batch.commit();
        return { success: true, message: 'Backup has been imported to the cloud.' };
    } catch (error: any) {
        console.error('Cloud Import Error:', error);
        return { success: false, message: error.message || 'Could not import data to the cloud. Please try again.' };
    }
}

export const clearFirestoreData = async () => {
    try {
        const app = getFirebaseApp();
        if (!app) {
            return { success: false, message: "Firebase is not configured. Please add your Firebase configuration to enable cloud features." };
        }
        const db = getFirestore(app);
        const batch = writeBatch(db);

        const collectionKeys = Object.values(COLLECTIONS);

        for (const collectionName of collectionKeys) {
            const querySnapshot = await getDocs(collection(db, collectionName));
            querySnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
        }
        
        // Also delete the profile document
        batch.delete(doc(db, 'profile', 'user_profile'));

        await batch.commit();
        return { success: true, message: 'All cloud data has been successfully cleared.' };
    } catch (error: any) {
        console.error('Cloud Data Clearing Error:', error);
        return { success: false, message: error.message || 'Could not clear cloud data. Please try again.' };
    }
}

    
