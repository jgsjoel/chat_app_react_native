import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {

    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#fff',

            }
        }}>
            <Tabs.Screen name="index" options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />,
            }} />
            <Tabs.Screen name="requests" options={{
                title: 'Friend Requests',
                headerShown: false,
                tabBarIcon: () => <MaterialIcons name="update" size={24} color="black" />,
            }} />
            <Tabs.Screen name="profile" options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: () => <FontAwesome name="user" size={24} color="black" />,
            }} />
        </Tabs>
    );
}