import { View } from 'react-native';
import ContactCard from '../components/ContactCard';
const ContactViewScreen = ({ navigation, route }) => {
    const { contact } = route.params;
    return (
        <View style={{ flex: 1 }}>
            <ContactCard contact={contact} />
        </View>
    );
};
export default ContactViewScreen;