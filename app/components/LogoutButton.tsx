'use client'
import { useTransition } from "react"
import { logout } from "@/app/actions/logout"

export default function LogoutButton() {
    const [isPending, startTransition] = useTransition()

    return (
        <button
            onClick={() => {
                startTransition(() => {
                    logout()
                })
            }}
            disabled={isPending}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
            {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
        </button>
    )
}