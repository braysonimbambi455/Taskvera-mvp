import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. Define paths that should NEVER be redirected by the proxy
  const publicPaths = ['/reset-password', '/forgot-password', '/', '/jobs', '/freelancers', '/about', '/contact', '/privacy']
  
  // 2. If the path is a public path, let it pass through
  if (publicPaths.some(p => path === p || path.startsWith(p + '/'))) {
    return response
  }

  // 3. Protected paths (Includes /admin now)
  const protectedPaths = ['/dashboard', '/post-job', '/messages', '/profile', '/contracts', '/proposals', '/admin']
  const isProtected = protectedPaths.some(p => path.startsWith(p))

  if (isProtected) {
    // If not logged in, send to login
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', path)
      return NextResponse.redirect(url)
    }

    // CHECK IF USER IS DEACTIVATED
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', user.id)
      .single()

    if (profile && profile.is_active === false) {
      // If deactivated, log them out and send to login with error
      await supabase.auth.signOut()
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'deactivated')
      return NextResponse.redirect(url)
    }
  }

  // 4. Redirect logged-in users away from login/register
  if ((path === '/login' || path === '/register') && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}