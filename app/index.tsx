import { Redirect } from "expo-router";
import { Text } from "react-native";

export default function MainIndex(){
    return (
        <Redirect href={"/(auth)"} />
    );
}