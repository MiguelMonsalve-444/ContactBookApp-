import {store, addContactAction, editContactAction, removeContactAction} from '../store/store';

export const contaxtContext = createContext();

export const addContact = (contact) => {
    //addConact in db
    console.log('Service:',contact);
    const newId = store.getState().contacts.length + 1; //generate new id
    store.dispatch(addContactAction({...contact, id: newId}));

};

export const editContact = (id, newData) => {
    //UpdateContact in db
    store.dispatch(editContactAction(id, newData));
};

export const removeContact = (id) => {
    //removeContact in db
    store.dispatch(removeContactAction(id));
};