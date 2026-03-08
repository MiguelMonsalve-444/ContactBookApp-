import {createStore} from 'redux';

const initialState = {contacts: []};

//Actions 

const ADD_CONTACT = 'ADD_CONTACT';
const EDIT_CONTACT = 'EDIT_CONTACT';
const DELETE_CONTACT = 'DELETE_CONTACT';

//Actions creators
export const addContactAction = (contact) =>
    ({ type: ADD_CONTACT, payload: contact});
export const editContactAction = (id, newData) =>
    ({ type: EDIT_CONTACT, payload: {id, newData}});
export const removeContactAction = (id) =>
    ({ type: DELETE_CONTACT, payload: id});

//reducer 
function contactsReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_CONTACT:
            return {...state, contacts: [...state.contacts, action.payload]};

        case EDIT_CONTACT:
            return {...state,contacts: state.contacts.map(c =>
                 (c._id === action.payload.id ? {...c, ...action.payload.newData} : c))};
        case DELETE_CONTACT:
            return {...state, contacts: state.contacts.filter(c => c._id !== action.payload)};
        default:
            return state;
    }
}

export const store = createStore(contactsReducer);