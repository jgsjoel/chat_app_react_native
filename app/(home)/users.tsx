import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Pressable, Modal, TouchableWithoutFeedback } from "react-native";
import { useEffect, useState } from "react";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { supabase } from "~/services/superbase";
import { useAuth } from "~/providers/AuthProvider";
import { PostgrestError } from "@supabase/supabase-js";
import React from "react";
import { Stack } from "expo-router";

export default function UserSearch() {

    const [query, setQuery] = useState("");
    const [profiles, setProfiles] = useState<any[] | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [username, setUserName] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");

    const [requestStatus, setRequestStatus] = useState<string | null>(null);

    const { user } = useAuth();

    const handleConnect = async () => {
        setButtonLoading(true);

        let { data, error } = await supabase.from("friend_requests").insert([{
            sender_id: user?.id, receiver_id: selectedUserId, status: false,
        }]).select();

        console.log(data);
        console.log(error);

        if (data) {
            setButtonLoading(false);
            setModalVisible(false);
        }
    };

    const checkSelectedUserStatus = async (selectedUserId: string) => {

        setButtonLoading(true);

        const { data, error } = await supabase.rpc('get_status', { sender_id:user?.id,receiver_id:selectedUserId })


        // let { data, error } = await supabase.from("friend_requests")
        //     .select("status")
        //     .or(`(sender_id.eq.${user?.id},receiver_id.eq.${selectedUserId})`)
        //     .or(`(sender_id.eq.${selectedUserId},receiver_id.eq.${user?.id})`);
        // .eq("sender_id", user?.id)
        // .eq("receiver_id", selectedUserId);
        console.log(data);

        if (data == false) {
            setRequestStatus("Request Sent");
        }else if(data == true){
            setRequestStatus("Connected");
        }else if (data == null) {
            setRequestStatus(null);
        }

        setButtonLoading(false);

    }

    const onModelOpen = (id: string, name: string) => {
        checkSelectedUserStatus(id);
        setModalVisible(true)
        setUserName(name);
        setSelectedUserId(id);
    }

    useEffect(() => {
        if (query.trim() === "") {
            setProfiles(null);
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                let { data: profiles, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .neq("id", user?.id)
                    .ilike("username", `%${query}%`);

                if (error) {
                    setError(error);
                } else {
                    setProfiles(profiles);

                }
            } catch (err) {
                setError(err as PostgrestError);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [query, user?.id]);

    return (
        <>
            <Stack.Screen options={{ title: "Search", headerTitleAlign: "center" }} />
            <SafeAreaView className="flex-1 bg-white">
                <View className="px-1 mt-2">
                    <View className="flex-row items-center bg-gray-200 p-3 rounded-lg">
                        <EvilIcons name="search" size={24} color="black" />
                        <TextInput
                            className="flex-1 text-base text-gray-800"
                            placeholder="Search users..."
                            placeholderTextColor="#A0A0A0"
                            value={query}
                            onChangeText={setQuery}
                        />
                        {query.length > 0 && (
                            <TouchableOpacity onPress={() => setQuery("")}>
                                <Text className="text-gray-500">clear</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    !query.trim() ? (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-gray-500 text-lg">Search users</Text>
                        </View>
                    ) : (
                        error ? (
                            <Text className="text-red-500 text-center">Error: {error.message}</Text>
                        ) : (
                            <FlatList
                                className="flex-1 bg-white"
                                data={profiles}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) =>
                                    <Pressable onPress={() => onModelOpen(item.id, item.username)} className="border-b flex-row border-y-gray-400">
                                        <Text className="font-bold text-xl p-3">{item.username}</Text>
                                    </Pressable>
                                }
                                ListEmptyComponent={
                                    <Text className="text-center text-gray-500">No matching users found</Text>
                                }
                            />
                        )
                    )
                )}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    {/* Close modal on background tap */}
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View className='flex-1 justify-center items-center bg-transparent'>
                            <TouchableWithoutFeedback onPress={() => { }}>
                                {/* Content View to prevent propagation */}
                                <View className='w-72 p-5 bg-slate-200 rounded-xl items-center'>
                                    {(requestStatus) ?
                                        <TouchableOpacity className='bg-gray-400 p-3 rounded-md mb-2 w-full items-center' disabled>
                                            {(buttonLoading) ?
                                                <ActivityIndicator /> :
                                                <Text className='text-white'>{requestStatus}</Text>
                                            }
                                        </TouchableOpacity>
                                        :
                                        <>
                                            <Text className='text-lg mb-4'>Connect with {username}</Text>
                                            <TouchableOpacity onPress={() => handleConnect()} className='bg-green-500 p-3 rounded-md mb-2 w-full items-center'>
                                                {(buttonLoading) ?
                                                    <ActivityIndicator /> :
                                                    <Text className='text-white'>Connect</Text>
                                                }
                                            </TouchableOpacity>
                                        </>
                                    }
                                    <View className="flex-row w-full justify-end mt-3">
                                        <Pressable
                                            onPress={() => {
                                                setButtonLoading(false);
                                                setModalVisible(false);
                                            }}
                                        >
                                            <Text className='text-black'>Cancel</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </SafeAreaView >
        </>
    );
}
