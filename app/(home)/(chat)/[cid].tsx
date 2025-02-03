import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Channel as ChannelType, StreamChat } from "stream-chat";
import { Channel, MessageInput, MessageList, ChatContext } from "stream-chat-expo";

export default function ChatScreen() {

    const [channel, setChannel] = useState<ChannelType | null>(null);
    const { cid } = useLocalSearchParams<{ cid: string }>();

    const { client, isOnline } = useContext(ChatContext);

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                const response = await client.queryChannels({ cid: cid });
                if (response.length === 0) {
                  console.log("No channel found");
                }
                setChannel(response[0]);
              } catch (error) {
                console.error("Error querying channels:", error);
              }
        }
        fetchChannel();
    }, [cid]);

    if (!channel) {
        return <ActivityIndicator />
    }

    return (
        <Channel channel={channel}>
            <MessageList />
            <MessageInput />
        </Channel>
    );

}