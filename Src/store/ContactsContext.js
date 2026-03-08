import React, {useState, useEffect,createContext, useContext} from "react";
import { createContactRealm, getAllContacts, updateContactRealm, removeContactRealm, openRealm } from "../db/Realm";

export const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
    const initRealm = async () => {
        await openRealm();
        const allContacts = getAllContacts();
          setContacts(allContacts);
    
        };   

        initRealm();
}, []);

    const addContact = (contact) => {
        const newId = createContactRealm(contact);
        setContacts(prev => [...prev, {...contact, _id: newId}]);
        };

    const editContact = (id, newData) => {
        updateContactRealm(id, newData);
        setContacts(prev => prev.map(c => (c._id === id ? {...c , ...newData} : c)));
    };

    const removeContact = (id) => {
       removeContactRealm(id);
        setContacts(prev => prev.filter(c => c._id !== id));
    };

    const value = {
        contacts,
        setContacts,
        addContact,
        editContact,
        removeContact
    }
    return (
        <ContactsContext.Provider value={value}>
            {children}
        </ContactsContext.Provider>
    )


};

export const useContactsContext = () => {
    return useContext(ContactsContext);
};
