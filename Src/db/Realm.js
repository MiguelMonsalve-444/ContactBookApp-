import Realm from 'realm';

//Define contact schema

const ContactSchema = {
    name: 'Contact',
    properties: {
        _id: 'int',
        name: 'string',
        phone: 'string',
        email: 'string?',
    },
    primaryKey: '_id',

};

let realm;
export const openRealm = async () => {

    //Initialize realm with the schema
    realm = await Realm.open({
        path: 'contacts.realm',
        schema: [ContactSchema],
    });
};
const createContactRealm = (newData) => {
    let newId;
    realm.write(() => {
        const maxId = realm.objects('Contact').max('_id');
        newId = maxId ? maxId + 1 : 1;
        realm.create('Contact', { ...newData, _id: newId });
    });
    return newId;
};

const getAllContacts = () => {
    const contacts = realm.objects('Contact');
    return contacts.map(c =>
    ({
        _id: c._id,
        name: c.name,
        phone: c.phone,
        email: c.email
    }));
};

const updateContactRealm = (id, newData) => {
    realm.write(() => {
        let contact = realm.objectForPrimaryKey('Contact', id);
        if (contact) {
            contact.name = newData.name;
            contact.phone = newData.phone;
            contact.email = newData.email;
        }
    });
};

const removeContactRealm = (id) => {
    realm.write(() => {
        let contact = realm.objectForPrimaryKey('Contact', id);
        if (contact) {
            realm.delete(contact);
        }
    });
};

export { createContactRealm, getAllContacts, updateContactRealm, removeContactRealm };