import {useState, useEffect} from "react";
import { TextInput, Button } from "react-native";

const ContactForm = ({ contact = {}, onSubmit }) => {
    const [name, setName] = useState(contact.name || "");
    const [phone, setPhone] = useState(contact.phone || "");
    const [email, setEmail] = useState(contact.email || "");

    const handleSubmit = () => {
        const validateAndSetContact = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
        };
        onSubmit(validateAndSetContact);
        
    };

    return (
        <>
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode= "outlined"
                style={{ marginBottom: 8 }}
            />
            <TextInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                mode= "outlined"
                style={{ marginBottom: 8 }}
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode= "outlined"
                style={{ marginBottom: 8 }}
            />
            <Button title="Save" onPress={handleSubmit} />
        </>
    );
};
export default ContactForm;