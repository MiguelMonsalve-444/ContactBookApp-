import { View, StyleSheet } from 'react-native';
import { Text, Chip, ActivityIndicator, Card } from 'react-native-paper';
import { useState, useEffect } from 'react';
import ContactCard from '../Components/ContactCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { checkContactSync } from '../Service/ContactService';
import { addNetworkListener, getNetworkStatus } from '../Service/MockSyncService';


const ContactViewScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { contact } = route.params;
    const [syncStatus, setSyncStatus] = useState({ 
        checking: true, 
        isSynced: false
    });
    const [isOnline, setIsOnline] = useState(getNetworkStatus());

    // Escuchar cambios de red
    useEffect(() => {
        const unsubscribe = addNetworkListener((connected) => {
            setIsOnline(connected);
        });
        return () => unsubscribe();
    }, []);

    // Verificar estado de sincronización del contacto
    useEffect(() => {
        const verifySyncStatus = async () => {
            setSyncStatus({ checking: true, isSynced: false });
            const result = await checkContactSync(contact);
            setSyncStatus({ 
                checking: false, 
                isSynced: result.isSynced
            });
        };
        verifySyncStatus();
    }, [contact]);

    return (
        <View style={{ flex: 1, padding: 10, paddingBottom: insets.bottom }}>
            {/* Status Card */}
            <Card style={styles.statusCard}>
                <Card.Content>
                    <View style={styles.statusRow}>
                        {/* Network Status */}
                        <Chip 
                            icon={isOnline ? "wifi" : "wifi-off"}
                            style={[styles.chip, isOnline ? styles.online : styles.offline]}
                            textStyle={styles.chipText}
                        >
                            {isOnline ? 'Online' : 'Offline'}
                        </Chip>
                        
                        {/* Sync Status */}
                        {syncStatus.checking ? (
                            <View style={styles.loadingRow}>
                                <ActivityIndicator size="small" />
                                <Text style={styles.loadingText}>Verificando...</Text>
                            </View>
                        ) : (
                            <Chip 
                                icon={syncStatus.isSynced ? "cloud-check" : "cloud-upload"}
                                style={[styles.chip, syncStatus.isSynced ? styles.synced : styles.pending]}
                                textStyle={styles.chipText}
                            >
                                {syncStatus.isSynced ? 'Sincronizado' : 'Pendiente'}
                            </Chip>
                        )}
                    </View>
                </Card.Content>
            </Card>

            <ContactCard contact={contact} />
        </View>
    );
};

const styles = StyleSheet.create({
    statusCard: {
        marginBottom: 10,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 12,
    },
    chip: {
        height: 32,
    },
    chipText: {
        color: 'white',
        fontSize: 12,
    },
    online: {
        backgroundColor: '#4CAF50',
    },
    offline: {
        backgroundColor: '#757575',
    },
    synced: {
        backgroundColor: '#4CAF50',
    },
    pending: {
        backgroundColor: '#FF9800',
    },
});

export default ContactViewScreen;