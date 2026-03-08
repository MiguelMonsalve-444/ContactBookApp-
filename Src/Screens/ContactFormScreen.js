import { View } from 'react-native';
import ContactForm from '../Components/ContactForm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addContactAction, editContactAction } from '../store/store';

const ContactFormScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { contact } = route.params ?? {};
    const dispatch = useDispatch();
    const contacts = useSelector(state => state.contacts);

    const onSubmit =  newContact => {
        if (contact?._id !== undefined) {
            console.log('Editing contact:', contact._id, newContact);
            dispatch(editContactAction(contact._id, newContact));
        } else {
            const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c._id)) + 1 : 1;
            console.log('Adding contact:', newContact);
            dispatch(addContactAction({...newContact, _id: newId}));
        }
        navigation.navigate('ContactList');
    }

    
    return (
        <View style={{ flex: 1, padding: 10, paddingBottom: insets.bottom }}>
           <ContactForm contact={contact} onSubmit={onSubmit} />
        </View>
    );
};
export default ContactFormScreen;