import {
    store,
    addContactAction,
    setContactsAction,
    editContactAction,
    removeContactAction} from '../store/store';
import {
    createContact,
    readContacts,
    updateContact,
    deleteContact,
    getContactById
 } from '../db/ContactsRepository';

//Agrega un contacto
 //Guarda en DB local con syncStatus='pending'
export const addContact = async contact => {
    const newId = await createContact(contact);
    const newContact = { ...contact, id: newId, syncStatus: 'pending' };
    store.dispatch(addContactAction(newContact));
};

export const setContacts = async () => {
    const allContacts = await readContacts();
    store.dispatch(setContactsAction(allContacts));
}; 

// Edita un contacto
//Actualiza en DB local con syncStatus='pending'

export const editContact = async (id, newData) => {
    await updateContact(id, newData);
    store.dispatch(editContactAction(id, { ...newData, syncStatus: 'pending' }));
};

// Elimina un contacto
export const removeContact = async id => {
    await deleteContact(id);
    store.dispatch(removeContactAction(id));
};

// Verificar si un contacto está sincronizado

/**
 *  @param {Object} contact - Contacto a verificar
 * @returns {Promise<{isSynced: boolean}>}
 */

export const checkContactSync = async (contact) => {
    try {
        if (!contact || !contact.id) {
            return { isSynced: false };
        }

        const dbContact = await getContactById(contact.id);
        
        if (!dbContact) {
            return { isSynced: false };
        }

        return {
            isSynced: dbContact.syncStatus === 'synced'
        };
    } catch (error) {
        console.log('Error checking contact sync: ', error);
        return { isSynced: false };
    }
};
