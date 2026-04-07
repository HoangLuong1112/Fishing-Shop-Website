import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export default function ForgotPassword() {

    async function handleReset(formData: FormData) {
        'use server'
        const email = formData.get('email') as string
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // Đây là link mà user sẽ bấm vào trong Email
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`,
        })

        if (error) 
            throw new Error(error.message)
    }

    return (
        <div className="bg-[#38384C] h-screen flex items-center justify-center">
            <form action={handleReset} className="w-200 h-auto m-4 border-4 border-white rounded-lg overflow-hidden">
                <div className="bg-[#C1E6FF] flex flex-col gap-4 p-4">
                    <p className="text-4xl font-bold py-5">Quên mật khẩu</p>
                    <div>
                        <label className="text-lg">Nhập Email của bạn</label>
                        <input name="email" type="email" required className="text-lg bg-white h-11 w-full" />
                    </div>
                    <button type="submit" className="h-12 text-2xl bg-blue-400 hover:bg-blue-500 transition">
                        Gửi yêu cầu
                    </button>
                </div>
            </form>
        </div>
    )
}
