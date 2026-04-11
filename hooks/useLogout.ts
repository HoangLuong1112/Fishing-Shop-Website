'use client'

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { logout } from "@/app/actions/logout"

export function useLogout() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleLogout = () => {
        startTransition(async () => {
            await logout()
            router.refresh()
            router.push('/login')
        })
    }

    return { handleLogout, isPending }
}