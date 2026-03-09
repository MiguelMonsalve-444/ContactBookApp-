import { FlatList, View } from 'react-native';
import{ FAB } from 'react-native-paper';
import ContactListItem from '../Components/ContactListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setContacts } from '../Service/ContactService';


const ContactListScreen = ({ navigation }) => {
const contacts = useSelector(state => state.contacts);
const insets = useSafeAreaInsets();

useEffect (() => {
    const fetchAllContacts = async () => {
     await setContacts();
    };
     fetchAllContacts();
}, []);
const renderItem = ({ item }) => (
    <ContactListItem
        contact={item}
        onPress={() => navigation.navigate('ContactView', { contact: item })}
        />

);

return (
    <View style={{flex: 1, marginBottom: insets.bottom }}>
        {/* render FlatList of contacts */}
        <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        />
        <FAB
        icon = "plus"
        style={{position: 'absolute', bottom: 16, right: 16}}
        onPress={() => navigation.navigate('ContactForm', { contact: {} })}
        />  

          
    </View>
    );
};
export default ContactListScreen;