import { useEffect } from "react";
import { useRouter, Slot, Redirect } from "expo-router";
import { useAuth } from "~/providers/AuthProvider";

export default function AuthLayout() {
  const { user } = useAuth();

    if (user) {
        console.log("user present------------------------------------------");
      return <Redirect href={"/(home)"}/>;
    }

  return <Slot/>;
}
