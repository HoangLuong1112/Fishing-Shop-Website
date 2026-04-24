'use client'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export default function LoginForm({ action }: { action: (formData: FormData) => Promise<any> }) {
    
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await action(formData)

            if (result?.error) {
                toast.error('Đăng nhập thất bại', {
                    description: result.error,
                })
                return
            }

            router.refresh()

            // điều hướng theo role
            if (result.role === 'admin') router.push('/admin')
            else if (result.role === 'manager') router.push('/manager')
            else router.push('/')
        })
    }
    
    return (
        <form action={onSubmit} className="w-250 h-auto m-4 grid md:grid-cols-2 bg-white border-4 border-white rounded-lg overflow-hidden">
            <div className="relative w-full h-full">
                <Image
                    alt="login-picture" 
                    src="/image/fish.jpg" 
                    fill // Tự động tràn hết thẻ cha
                    className="object-cover" 
                    sizes="(max-width: 1000px) 50vw, 500px" // Tối ưu hóa kích thước ảnh dựa trên kích thước màn hình (cho cái tt fill)
                    loading="eager" //ưu tiên tải ảnh này trước khi hiển thị trang
                />
            </div>

            <div className="bg-[#C1E6FF] flex flex-col gap-4 p-4">
                <p className="text-4xl font-bold py-5">Welcome to Fishing Shop</p>

                <div>
                    <label className="text-lg">Email đăng nhập</label>
                    <input name="email" type="email" required className="text-lg bg-white h-11 w-full px-2" />
                </div>
                <div>
                    <label className="text-lg">Mật khẩu</label>
                    <input name="password" type="password" required className="text-lg bg-white h-11 w-full px-2" />
                </div>

                <button 
                    type="submit"
                    disabled={isPending}
                    className="h-12 text-2xl bg-blue-400 hover:bg-blue-500 transition">
                    {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
                
                <Link href="/signup" className="h-12 text-2xl bg-blue-400 hover:bg-blue-500 transition flex items-center justify-center">
                    Đăng ký
                </Link>
                
                <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700 underline">
                    Quên mật khẩu?
                </Link>
            </div>

        </form>
    )
}