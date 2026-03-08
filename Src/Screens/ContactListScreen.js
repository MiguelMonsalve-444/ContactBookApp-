import { FlatList, View } from 'react-native';
import{ FAB } from 'react-native-paper';
import ContactListItem from '../Components/ContactListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const ContactListScreen = ({ navigation }) => {
const contacts = useSelector(state => state.contacts);
const insets = useSafeAreaInsets();


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
        keyExtractor={(item) => item._id.toString()}
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