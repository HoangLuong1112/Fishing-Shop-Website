"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const loadUser = async () => {
            console.log("Loading user...")
            const { data } = await supabase.auth.getUser();
            console.log("User data from supabase.auth.getUser():", data);
            if (!data.user) {
                setUser(null);
                setLoading(false);
                return;
            }

            // lấy thêm profile từ bảng User
            const { data: profile } = await supabase
                .from("User")
                .select("*")
                .eq("id", data.user.id)
                .single();

            setUser({
                ...data.user,
                profile,
            });

            setLoading(false);
        };

        loadUser();

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_, session) => {
                if (!session?.user) {
                    setUser(null);
                    return;
                }

                const { data: profile } = await supabase
                    .from("User")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                setUser({
                    ...session.user,
                    profile,
                });
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return { user, loading };
}

/*
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// đây là cái hook lấy user thật
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
*/