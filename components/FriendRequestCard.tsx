import { Text, View } from "react-native";

const FriendRequest = ({ item }: { item: any }) => (
    <View className="flex-row justify-between">
        <Text>
            Request ID: {item.id}
        </Text>
        <Text >
            Status: {item.status ? "Accepted" : "Pending"}
        </Text>
        <Text >
            Sender: {item.sender?.username || "Unknown"}
        </Text>
        <Text >
            Sender ID: {item.sender?.id || "N/A"}
        </Text>
    </View>
);

export default FriendRequest;