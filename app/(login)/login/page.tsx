import LoginForm from "@/app/components/LoginForm"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function Login() {

    // Server Action
    async function handleLogin(formData: FormData) {
        'use server'

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // gọi api đăng nhập của supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            return { error: error.message }
        }

        // lấy role diều hướng trang
        const { data: profile } = await supabase
            .from('User')
            .select('role')
            .eq('id', data.user.id)
            .single()

        const role = profile?.role || 'client'
        if (role === 'admin') redirect('/admin')
        if (role === 'manager') redirect('/manager')
        if (role === 'employee') redirect('/manager')
        redirect('/')
    }

    return (
        <div className="bg-[#38384C] h-screen flex items-center justify-center">
            {/* Tách giao diện với logic ra để dễ kiểm soát server/client render */}
            <LoginForm action={handleLogin} />
            
        </div>
    )
}