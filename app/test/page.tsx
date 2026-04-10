"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function TestUserPage() {
    useEffect(() => {
        const supabase = createClient();

        const runTest = async () => {
            console.log("🚀 START TEST");

            // 1. check session
            const { data: sessionData } = await supabase.auth.getSession();
            console.log("🟡 session:", sessionData);

            // 2. check user
            const { data: userData } = await supabase.auth.getUser();
            console.log("🟢 user:", userData);

            // 3. query bảng User (KHÔNG filter)
            const { data: allUsers, error: allError } = await supabase
                .from("User")
                .select("*");

            console.log("🔵 allUsers:", allUsers);
            console.log("🔴 allError:", allError);

            // 4. query theo id
            const userId = userData.user?.id;

            if (userId) {
                const { data: profile, error: profileError } = await supabase
                    .from("User")
                    .select("*")
                    .eq("id", userId);

                console.log("🟣 profile:", profile);
                console.log("⚫ profileError:", profileError);
            } else {
                console.log("❌ No userId");
            }
        };

        runTest();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Test User Page</h1>
            <p>Mở console để xem kết quả</p>
        </div>
    );
}