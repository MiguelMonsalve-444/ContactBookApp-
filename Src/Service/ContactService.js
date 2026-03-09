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
    deleteContact
 } from '../db/ContactsRepository';

export const addContact = async contact => {
    const newId = await createContact(contact);
    store.dispatch(addContactAction({...contact, id: newId}));

};
export const setContacts = async () => {
    //No recive ningun parametro y lo toma del data base y lo setea en el store
    const allContacts = await readContacts();
    store.dispatch(setContactsAction(allContacts));
}; 
export const editContact = async (id, newData) => {
    await updateContact(id, newData);
    store.dispatch(editContactAction(id, newData));
};

export const removeContact = async id => {
     await deleteContact(id);
    store.dispatch(removeContactAction(id));
};