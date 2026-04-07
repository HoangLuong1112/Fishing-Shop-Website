import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function ResetPassword() {
    async function updatePassword(formData: FormData) {
        'use server'
        const password = formData.get('password') as string
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { error } = await supabase.auth.updateUser({ password })

        if (error) 
            throw new Error(error.message)
        
        return redirect('/login')
    }

    return (
        <div className="bg-[#38384C] h-screen flex items-center justify-center p-4">
            <form action={updatePassword} className="bg-[#C1E6FF] p-8 rounded-lg w-full max-w-md flex flex-col gap-4">
                <p className="text-2xl font-bold">Nhập mật khẩu mới</p>
                <input name="password" type="password" placeholder="Mật khẩu mới" required className="h-11 px-3" />
                <button type="submit" className="bg-blue-400 h-11 hover:bg-blue-500 transition">
                    Cập nhật mật khẩu
                </button>
            </form>
        </div>
    )
}