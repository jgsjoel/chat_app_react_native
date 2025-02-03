import { PropsWithChildren, useEffect } from "react";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { StreamChat } from "stream-chat";
import { useAuth } from "./AuthProvider";
import { supabase } from "~/services/superbase";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API!);

export default function ChatProvider({ children }: PropsWithChildren) {
    
    const {session} = useAuth();

    useEffect(() => {

        const getUserProfile = async () => {
              return await supabase
              .from("profiles")
              .select("*")
              .eq("id", session!.user.id)
              .single();
            }
        
        const connect = async () => {

            const profile = await getUserProfile();
            console.log(profile.data.id);

            await client.connectUser(
                {
                    id: profile.data.id,
                    name: profile.data.username,
                    image: supabase.storage.from('avatars').getPublicUrl(profile.data.avatar_url).data.publicUrl,
                },
                client.devToken(profile.data.id),
            );
        }
    
        connect();

        return ()=>{
            client.disconnectUser();
        }
    }, [session]);

    return (
        <OverlayProvider>
            <Chat client={client}>
                {children}
            </Chat>
        </OverlayProvider>
    );
}