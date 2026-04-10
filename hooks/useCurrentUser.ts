"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// đây là cái hook lấy user info từ session, đồng thời fetch thêm profile info từ bảng User
export function useCurrentUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchFullProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from("User")
            .select("*")
            .eq("id", userId)
            .single();
        
        if (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
        return data;
        };

        const initialize = async () => {
        setLoading(true);
        // 1. Lấy session hiện tại
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            const profile = await fetchFullProfile(session.user.id);
            setUser(profile);
        }
        setLoading(false);
        };

        initialize();

        // 2. Lắng nghe thay đổi auth
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
            const profile = await fetchFullProfile(session.user.id);
            setUser(profile);
            }
        } else if (event === 'SIGNED_OUT') {
            setUser(null);
        }
        });

        return () => {
        authListener.subscription.unsubscribe();
        };
    }, []);

    return { user, loading };
}