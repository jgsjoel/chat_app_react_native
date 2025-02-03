import '../global.css';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Slot } from 'expo-router';
import AuthProvider from '~/providers/AuthProvider';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
