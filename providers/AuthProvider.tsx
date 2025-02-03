import { PostgrestSingleResponse, Session, User } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from "~/services/superbase";

type AuthContext = {
  session: Session | null;
  user: User | null;
  profile:any|null;
}

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  profile:null,
});

export default function AuthProvider({ children }: PropsWithChildren) {

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PostgrestSingleResponse<any>>();

  useEffect(() => {

    if (!session?.user) {
      return;
    }

    const getUserProfile = async () => {
      const userProfile = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
      setProfile(userProfile["data"]);
    }

    getUserProfile();

  }, [session?.user]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ session: session, user: session?.user ?? null ,profile:profile}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);