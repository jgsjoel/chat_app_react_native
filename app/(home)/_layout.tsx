import { Redirect, Stack } from "expo-router";
import ChatProvider from "../../providers/ChatProvider";
import { useAuth } from "~/providers/AuthProvider";

export default function HomeLayout() {

    const {user} = useAuth();

    if(!user){
        return <Redirect href={"/(auth)"}/>
    }

    return (
        <ChatProvider>
            <Stack>
                <Stack.Screen options={{ headerShown: false }} name='(tabs)' />
                <Stack.Screen options={{ title: "Chat", headerTitleAlign: "center" }} name='(chat)' />
            </Stack>
        </ChatProvider>
    );
}