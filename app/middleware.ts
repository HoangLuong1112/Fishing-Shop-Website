import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            get(name: string) { return request.cookies.get(name)?.value },
            set(name: string, value: string, options: CookieOptions) {
                request.cookies.set({ name, value, ...options })
                response = NextResponse.next({ request: { headers: request.headers } })
                response.cookies.set({ name, value, ...options })
            },
            remove(name: string, options: CookieOptions) {
                request.cookies.set({ name, value: '', ...options })
                response = NextResponse.next({ request: { headers: request.headers } })
                response.cookies.set({ name, value: '', ...options })
            },
        },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()

    // Nếu đã login → không cho vào login
    if (user && url.pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // LẤY ROLE TỪ BẢNG USER
    let role = 'client'
    if (user) {
        const { data: profile } = await supabase
            .from('User') 
            .select('role')
            .eq('id', user.id)
            .single()

        role = profile?.role || 'client'
    }

    
    // Chỉ admin đc vào /admin
    if (url.pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Chỉ manager/admin/employee đc vào /manager
    if (url.pathname.startsWith('/manager') && !['manager', 'admin', 'employee'].includes(role)) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*', '/manager/:path*', '/login'],
}