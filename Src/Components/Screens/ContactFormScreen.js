import { View } from "react-native";
import ContactForm from "../Components/ContactForm";

const ContactFormScreen = ({ navigation, route }) => {
    const { contact = {} } = route.params;

    const onSubmit = ({ name, phone, email }) => {
        // save contact to database
        navigation.goBack();
    };

    return (
        <View style={{ flex: 1 }}>
           <ContactForm contact={contact} onSubmit={onSubmit} />
        </View>
    );
};
export default ContactFormScreen;