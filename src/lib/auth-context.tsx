import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  loginMockUser: (email: string, fullName?: string, phone?: string) => void;
}>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  loginMockUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session first
    const mock = localStorage.getItem("mock_session");
    if (mock) {
      const parsed = JSON.parse(mock);
      setSession(parsed);
      setUser(parsed.user);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (localStorage.getItem("mock_session")) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    localStorage.removeItem("mock_session");
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const loginMockUser = (email: string, fullName?: string, phone?: string) => {
    const mockSession = {
      access_token: "mock-token",
      user: {
        id: "mock-id",
        email: email,
        phone: phone,
        user_metadata: {
          full_name: fullName,
        },
      },
    };
    localStorage.setItem("mock_session", JSON.stringify(mockSession));
    setSession(mockSession as unknown as Session);
    setUser(mockSession.user as unknown as User);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, loginMockUser }}>
      {children}
    </AuthContext.Provider>
  );
}
