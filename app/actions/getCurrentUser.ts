import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// test lấy user ở server action
export async function getCurrentUser() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    // const { data: users, error } = await supabase.from('User').select('*')
    
    if (!user) return null

    const { data: profile } = await supabase
        .from("User")
        .select("*")
        .eq("id", user.id)
        .single()

    return {
        ...user,
        profile,
    }
}