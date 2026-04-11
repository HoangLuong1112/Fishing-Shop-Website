'use client'
import { useLogout } from "@/hooks/useLogout"

export default function LogoutButton() {
    const { handleLogout, isPending } = useLogout()

    return (
        <button onClick={handleLogout} disabled={isPending}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
            {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
        </button>
    )
}