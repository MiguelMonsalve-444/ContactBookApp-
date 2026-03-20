//MockSyncService - Detecta estado de red (online/offline) y simula sincronización

import NetInfo from '@react-native-community/netinfo';
import { readContacts, updateContactSyncStatus, getPendingContacts } from '../db/ContactsRepository';
import { store, setContactsAction } from '../store/store';

//  NETWORK STATE 

let isConnected = false;
let networkListeners = [];
let unsubscribeNetInfo = null;

// Inicializa el listener de estado de red
export const initNetworkListener = () => {
    if (unsubscribeNetInfo) {
        return;
    }

    unsubscribeNetInfo = NetInfo.addEventListener(state => {
        const wasConnected = isConnected;
        isConnected = state.isConnected && state.isInternetReachable !== false;
        console.log('Network status:', isConnected ? 'Online' : 'Offline');
        
        // Notificar a los listeners
        networkListeners.forEach(listener => listener(isConnected));
        
        // Auto-sync cuando vuelve online
        if (isConnected && !wasConnected) {
            syncPendingContacts();
        }
    });

    // Obtener estado inicial
    NetInfo.fetch().then(state => {
        isConnected = state.isConnected && state.isInternetReachable !== false;
    });
};

// Limpia el listener de red

export const cleanupNetworkListener = () => {
    if (unsubscribeNetInfo) {
        unsubscribeNetInfo();
        unsubscribeNetInfo = null;
    }
    networkListeners = [];
};

// Registra un listener para cambios de red 
export const addNetworkListener = (listener) => {
    networkListeners.push(listener);
    listener(isConnected);
    
    return () => {
        networkListeners = networkListeners.filter(l => l !== listener);
    };
};

// Retorna el estado actual de conexión
export const getNetworkStatus = () => isConnected;

// SYNC SIMULATION 

// Sincroniza un contacto individual (simulado)
export const syncContact = async (contactId) => {
    if (!isConnected) {
        console.log('Cannot sync - offline');
        return false;
    }
    
    try {
        // Simular delay de servidor
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!isConnected) return false;
        
        await updateContactSyncStatus(contactId, 'synced');
        
        const allContacts = await readContacts();
        store.dispatch(setContactsAction(allContacts));
        
        console.log('Contact synced:', contactId);
        return true;
    } catch (error) {
        console.log('Sync error:', error);
        return false;
    }
};

// Sincroniza todos los contactos pendientes
export const syncPendingContacts = async () => {
    if (!isConnected) {
        return { synced: 0, failed: 0 };
    }
    
    try {
        const pending = await getPendingContacts();
        let synced = 0;
        let failed = 0;
        
        for (const contact of pending) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (!isConnected) {
                failed += pending.length - synced;
                break;
            }
            
            try {
                await updateContactSyncStatus(contact.id, 'synced');
                synced++;
            } catch {
                failed++;
            }
        }
        
        const allContacts = await readContacts();
        store.dispatch(setContactsAction(allContacts));
        
        console.log('Sync complete:', synced, 'synced,', failed, 'failed');
        return { synced, failed };
    } catch (error) {
        console.log('Sync error:', error);
        return { synced: 0, failed: 0 };
    }
};

//Marca todos como pendientes (para testing)
export const resetSyncStatus = async () => {
    try {
        const contacts = await readContacts();
        for (const c of contacts) {
            await updateContactSyncStatus(c.id, 'pending');
        }
        const allContacts = await readContacts();
        store.dispatch(setContactsAction(allContacts));
    } catch (error) {
        console.log('Reset error:', error);
    }
}; 
        