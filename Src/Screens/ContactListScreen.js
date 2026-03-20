import { FlatList, View, StyleSheet } from 'react-native';
import{ FAB, Chip } from 'react-native-paper';
import ContactListItem from '../Components/ContactListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setContacts } from '../Service/ContactService';
import { addNetworkListener, getNetworkStatus } from '../Service/MockSyncService';


const ContactListScreen = ({ navigation }) => {
const contacts = useSelector(state => state.contacts);
const insets = useSafeAreaInsets();
const [isOnline, setIsOnline] = useState(getNetworkStatus());

// Escuchar cambios de red
useEffect(() => {
    const unsubscribe = addNetworkListener((connected) => {
        setIsOnline(connected);
    });
    return () => unsubscribe();
}, []);

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
        {/* Network Status Bar */}
        <View style={styles.statusBar}>
            <Chip 
                icon={isOnline ? "wifi" : "wifi-off"}
                style={[styles.statusChip, isOnline ? styles.online : styles.offline]}
                textStyle={styles.chipText}
            >
                {isOnline ? 'Online' : 'Offline'}
            </Chip>
        </View>

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

const styles = StyleSheet.create({
    statusBar: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    statusChip: {
        height: 28,
    },
    chipText: {
        color: 'white',
        fontSize: 11,
    },
    online: {
        backgroundColor: '#4CAF50',
    },
    offline: {
        backgroundColor: '#757575',
    },
});

export default ContactListScreen;