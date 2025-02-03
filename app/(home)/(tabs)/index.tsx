import { ChannelList } from "stream-chat-expo";
import { Link, router, Stack } from "expo-router";
import { useAuth } from "~/providers/AuthProvider";
import React from "react";
import Entypo from '@expo/vector-icons/Entypo';

export default function Home() {

    const { user } = useAuth();

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: "Chat",
                headerTitleAlign:"center",
                headerRight: () => (
                    <Link href={"/users"} className="me-4">
                        <Entypo name="add-user" size={24} color="black" />
                    </Link>
                )
            }} />
            <ChannelList filters={{ members: { $in: [user!.id] } }} onSelect={(channel) => router.push(`../(chat)/${channel.cid}`)} />
        </>
    );
}