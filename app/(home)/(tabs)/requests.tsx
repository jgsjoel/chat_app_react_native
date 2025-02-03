import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { useChatContext } from "stream-chat-expo";
import { useAuth } from "~/providers/AuthProvider";
import { supabase } from "~/services/superbase";

export default function FriendRequests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);

    const { client } = useChatContext();

    useEffect(() => {
        fetchMessages();

        const subscription = supabase
            .channel("public:messages")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "friend_requests" },
                async (payload) => {
                    if (payload) {
                        fetchMessages();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("friend_requests")
            .select(`
                id,
                status,
                sender:profiles!sender_id(
                    id,username,avatar_url
                ),
                receiver:profiles!receiver_id(
                    id,username,avatar_url
                )
            `)
            .eq("receiver_id", user?.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setRequests(data);
        }
    };

    const createChannel = async (acceptedFriend: string) => {
        try {
            if (!user?.id) return;

            const channel = client.channel('messaging', {
                members: [`${user.id}`,acceptedFriend],
            });

            await channel.create();

            console.log(channel.id);

            router.push(`../(chat)/${channel.cid}`);
        } catch (error) {
            console.log(error);
        }
    };


    const handleAccept = async (id: number) => {
        try {
            const { data, error } = await supabase
                .from("friend_requests")
                .update({ status: true })
                .eq("id", id).select();

                console.log(data);

            if (data && data.length > 0) {
                createChannel(data[0].sender_id);
            }

            if (error) {
                console.error("Error updating friend request status:", error);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="flex-row justify-between items-center shadow-slate-400 p-3 rounded">
                        <View className="flex-row items-center min-w-fit">
                            <Text className="font-bold">{item.sender?.username}</Text>
                        </View>
                        <Pressable
                            onPress={() => handleAccept(item.id)}
                            className={`p-3 rounded-full ${item.status ? 'bg-gray-400' : 'bg-green-600'}`}
                            disabled={item.status}
                        >
                            <Text className="text-white">
                                {item.status ? 'Connected' : 'Accept'}
                            </Text>
                        </Pressable>
                    </View>
                )}
                ListEmptyComponent={
                    <View className="flex-1 h-screen justify-center items-center">
                        <Text className="text-gray-500 text-center">
                            No Friend Requests found
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
