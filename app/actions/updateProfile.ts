'use server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
    const username = formData.get("username") as string

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    console.log("Updating username to:", username)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    await supabase
        .from("User")
        .update({ username })
        .eq("id", user.id)

    // 🔥 refresh server data
    revalidatePath('/profile')
}