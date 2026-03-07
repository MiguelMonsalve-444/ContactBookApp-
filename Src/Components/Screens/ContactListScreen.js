import { useEffect, useState } from "react";
import { FlatList, View, Text } from "react-native";
import{ FAB } from "react-native-paper";
import ContactListItem from "../contacListItem";
import { getContacts } from "../../services/contactService";

const ContactListScreen = ({ navigation }) => {
const [contacts, setContacts] = useState([]);

useEffect(() => {
    // fetch coontacts from database and serContacts
}, []);

const renderItem = ({ item }) => (
    <ContactListItem
        contact={item}
        onPress={() => navigation.navigate("ViewContact", { contactId: item.id })}
        />

);

return (
    <View style={{flex: 1}}>
        // render FlatList of contacts
        <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        />
        <FAB
        icon = "plus"
        style={{
            position: "absolute", bottom: 16, right: 16}}
        onPress={() => navigation.navigate("AddContact")}
        />  

          
    </View>
    );
};
export default ContactListScreen;