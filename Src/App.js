import { NavigationContainer } from "@react-navigation/native";
import {Provider as PaperProvider} from 'react-native-paper';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContactListScreen from "./Screens/ContactListScreen";
import ContactViewScreen from "./Screens/ContactViewScreen";
import ContactFormScreen from "./Screens/ContactFormScreen"; 
import {Provider as ReduxProvider} from 'react-redux';
import {store} from './store/store';
import { useEffect } from "react";
import { initDB } from "./db/ContactsRepository";


const Stack = createNativeStackNavigator();


export default function App() {
    useEffect (()=> {
     initDB();
    }, []);
     return (
        <PaperProvider>
            <ReduxProvider store={store}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="ContactList">
                    <Stack.Screen 
                    name="ContactList"
                    component={ContactListScreen}
                  options={{ title: 'Contacts' }} 
                     />
                    <Stack.Screen
                    name="ContactView"
                    component={ContactViewScreen}
                    options={{ title: 'View Contact' }}
                    />
                    <Stack.Screen
                    name="ContactForm"
                    component={ContactFormScreen}
                    options={({ route }) => ({ 
                        title: route.params?.contact ? 'Edit Contact' : 'Add Contact' 
                    })}
                    />


                    </Stack.Navigator>
                </NavigationContainer>
            </ReduxProvider>
        </PaperProvider>
    );
}