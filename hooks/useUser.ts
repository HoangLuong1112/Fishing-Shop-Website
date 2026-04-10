
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// đây là cái hook lấy user info từ session
export function useUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        // lấy user ban đầu
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            setLoading(false);
        };

        getUser();

        // listen auth change
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return { user, loading };
}
