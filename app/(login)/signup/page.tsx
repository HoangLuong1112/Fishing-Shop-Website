import SignupForm from "@/app/components/SignupForm"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function Signup() {

    // Server Action
    async function handleSignup(formData: FormData) {
        'use server'

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const username = formData.get('username') as string
        
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // 1. Gọi hàm Đăng ký của Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                }
            }
        })

        if (error) {
            return { error: error.message }
        }

        redirect('/login')
    }

    return (
        <div className="bg-[#38384C] h-screen flex items-center justify-center">
            <SignupForm action={handleSignup} />
        </div>
    )
}