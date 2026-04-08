import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()

    // login → không cho vào /login
    if (user && url.pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Chưa login → chặn toàn bộ (trừ /login)
    if (!user && (url.pathname !== '/login' && url.pathname !== '/' && url.pathname !== '/test')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    let role = 'client'

    if (user) {
        const { data: profile } = await supabase
            .from('User')
            .select('role')
            .eq('id', user.id)
            .single()

        role = profile?.role || 'client'
    }

    // Admin guard
    if (url.pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Manager guard
    if (url.pathname.startsWith('/manager') && !['manager', 'admin', 'employee'].includes(role)) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return response
}

export const config = {
  matcher: [
    /*
     * Match toàn bộ route trừ:
     * - _next (static files)
     * - image
     * - favicon
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}