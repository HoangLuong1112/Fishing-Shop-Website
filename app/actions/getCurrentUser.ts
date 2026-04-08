import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    const { data: users, error } = await supabase.from('User').select('*')
    
    if (!user) return null

    // console.log("get Current User:", user)

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