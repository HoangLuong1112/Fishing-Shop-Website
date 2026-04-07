'use client'
import { useTransition } from "react"
import { toast } from "sonner"

export default function SignupForm({ action }: { action: (formData: FormData) => Promise<any> }) {

    const [isPending, startTransition] = useTransition()

    function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await action(formData)

            if (result?.error) {
                toast.error('Đăng ký thất bại', {
                    description: result.error,
                })
            }
        })
    }

    return (
        <form action={onSubmit} className="w-200 h-auto m-4 border-4 border-white rounded-lg overflow-hidden">
                
            <div className="bg-[#C1E6FF] flex flex-col gap-4 p-4">
                <p className="text-4xl font-bold py-5">Tạo tài khoản mới</p>
                <div>
                    <label className="text-lg">Email</label>
                    <input name="email" type="email" required className="text-lg bg-white h-11 w-full" />
                </div>
                <div>
                    <label className="text-lg">Tên đăng nhập</label>
                    <input name="username" type="text" required className="text-lg bg-white h-11 w-full" />
                </div>
                <div>
                    <label className="text-lg">Mật khẩu</label>
                    <input name="password" type="password" required className="text-lg bg-white h-11 w-full" />
                </div>

                <button 
                    type="submit"
                    disabled={isPending}
                    className="h-12 text-2xl bg-blue-400 hover:bg-blue-500 transition">
                    {isPending ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
                
            </div>

        </form>

    )
}