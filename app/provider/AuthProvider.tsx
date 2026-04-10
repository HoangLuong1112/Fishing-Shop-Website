"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const AuthContext = createContext<any>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchFullProfile = async (supabaseUser: any) => {
        if (!supabaseUser) return null;
        const { data } = await supabase
        .from("User")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();
        return { ...supabaseUser, profile: data };
    };

    useEffect(() => {
        const initAuth = async () => {
        // Dùng getSession để lấy nhanh từ cache
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const fullUser = await fetchFullProfile(session.user);
            setUser(fullUser);
        }
        setLoading(false);
        };

        initAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            const fullUser = await fetchFullProfile(session.user);
            setUser(fullUser);
        } else {
            setUser(null);
        }
        setLoading(false);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);