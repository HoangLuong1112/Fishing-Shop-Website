import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // 'next' là nơi mình muốn user đến sau khi xác thực xong (trong trường hợp này là /reset-password)
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        
        // Đổi cái 'code' lấy 'session'
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Nếu có lỗi, về trang login
    return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}