import { Redirect, Slot } from "expo-router";

export default function HomeIndex() {
    return (
        <Redirect href="/(home)/(tabs)" />
    );
}