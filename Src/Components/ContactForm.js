import {useState} from "react";
import { Alert } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";

const ContactForm = ({ contact, onSubmit }) => {
    const [name, setName] = useState(contact?.name || "");
    const [phone, setPhone] = useState(contact?.phone || "");
    const [email, setEmail] = useState(contact?.email || "");
    const [errors, setErrors] = useState({});

    const validateEmail = (value) => {
        if (!value) return true; // email es opcional
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const validatePhone = (value) => /^[\d\s\-+()]{7,}$/.test(value);

    const handleSubmit = () => {
        const newErrors = {};
        
        if (!name.trim()) {
            newErrors.name = "El nombre es requerido";
        }
        
        if (!phone.trim()) {
            newErrors.phone = "El teléfono es requerido";
        } else if (!validatePhone(phone.trim())) {
            newErrors.phone = "Formato de teléfono inválido (mínimo 7 dígitos)";
        }
        
        if (email.trim() && !validateEmail(email.trim())) {
            newErrors.email = "Formato de email inválido";
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Alert.alert("Error de validación", "Por favor corrige los campos marcados");
            return;
        }
        
        setErrors({});
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
                style={{ marginBottom: 4 }}
                error={!!errors.name}
            />
            <HelperText type="error" visible={!!errors.name}>
                {errors.name}
            </HelperText>
            <TextInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                mode= "outlined"
                style={{ marginBottom: 4 }}
                error={!!errors.phone}
            />
            <HelperText type="error" visible={!!errors.phone}>
                {errors.phone}
            </HelperText>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                mode= "outlined"
                style={{ marginBottom: 4 }}
                error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>
                {errors.email}
            </HelperText>
            <Button mode="contained" onPress={() => handleSubmit()} disabled={!name || !phone}>
                Save
            </Button>
        </>
    );
};
export default ContactForm;