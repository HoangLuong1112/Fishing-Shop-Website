'use server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// không gọi redirect ở đây vì logout có thể được gọi từ nhiều trang khác nhau, việc redirect sẽ gây lỗi
export async function logout() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    await supabase.auth.signOut()

    return { success: true }
}