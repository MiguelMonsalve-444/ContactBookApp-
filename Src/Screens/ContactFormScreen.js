import { View } from 'react-native';
import ContactForm from '../Components/ContactForm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addContact, editContact } from '../Service/ContactService';

const ContactFormScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { contact } = route.params ?? {};


    const onSubmit = async newContact => {
        console.log('onSubmit', newContact);
        try {
            if (contact?.id !== undefined) {
                await editContact(contact.id, newContact);
            } else {
                await addContact(newContact);
            }
            navigation.navigate('ContactList');
        } catch (error) {
            console.log('Error saving contact:', error);
        }
    }

    
    return (
        <View style={{ flex: 1, padding: 10, paddingBottom: insets.bottom }}>
           <ContactForm contact={contact} onSubmit={onSubmit} />
        </View>
    );
};
export default ContactFormScreen;