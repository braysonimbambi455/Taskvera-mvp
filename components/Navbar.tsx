'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, Bell } from 'lucide-react'
import type { Profile } from '@/types/database'

export default function Navbar() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: p } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        setProfile(p)

        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', data.user.id)
          .eq('read', false)
        setUnread(count ?? 0)
      }
      setLoadingProfile(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => {
      setUser(s?.user ?? null)
      if (!s?.user) setProfile(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname?.startsWith(href + '/')
  }

  const linkClass = (href: string) =>
    `text-[15px] font-semibold tracking-wide transition-colors duration-150 outline-none focus:outline-none ${
      isActive(href)
        ? 'text-amber-400'
        : 'text-gray-100 hover:text-amber-300'
    }`

  // THE FIX: If profile is still loading, send them to the generic /dashboard 
  // router (which we built earlier to check the role and redirect).
  const dashboardLink = loadingProfile 
    ? '/dashboard' 
    : (profile?.role === 'client' ? '/dashboard/client' : '/dashboard/freelancer')

  return (
    <nav className="bg-gray-900 border-b-2 border-amber-500 sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-extrabold text-white tracking-tight hover:text-amber-300 transition-colors outline-none focus:outline-none"
          >
            Task<span className="text-amber-400">Vera</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={linkClass('/')}>Home</Link>
            <Link href="/jobs" className={linkClass('/jobs')}>Find Work</Link>
            <Link href="/freelancers" className={linkClass('/freelancers')}>Freelancers</Link>

            {profile?.role === 'client' && (
              <>
                <Link href="/post-job" className={linkClass('/post-job')}>Post a Job</Link>
                <Link href="/proposals" className={linkClass('/proposals')}>Proposals</Link>
              </>
            )}

            {user ? (
              <>
                <Link href={dashboardLink} className={linkClass(dashboardLink)}>
                  Dashboard
                </Link>
                <Link href="/messages" className={linkClass('/messages')}>Messages</Link>

                <Link
                  href="/notifications"
                  className={`relative transition-colors outline-none focus:outline-none ${
                    isActive('/notifications') ? 'text-amber-400' : 'text-gray-100 hover:text-amber-300'
                  }`}
                >
                  <Bell className="w-5 h-5" strokeWidth={2.5} />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>

                <Link
                  href={`/profile/${user.id}`}
                  className={`text-[15px] font-semibold transition-colors outline-none focus:outline-none ${
                    pathname?.startsWith('/profile') ? 'text-amber-400' : 'text-gray-100 hover:text-amber-300'
                  }`}
                >
                  {profile?.full_name?.split(' ')[0] ?? 'Profile'}
                </Link>

                <button onClick={logout} className="text-[15px] font-semibold text-red-400 hover:text-red-300 transition-colors outline-none focus:outline-none">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[15px] font-semibold text-gray-100 hover:text-amber-300 transition-colors outline-none focus:outline-none">
                  Login
                </Link>
                <Link href="/register" className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg font-bold text-[15px] hover:bg-amber-400 transition-colors shadow-md outline-none focus:outline-none">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 -mr-2 outline-none focus:outline-none"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${open ? 'max-h-[800px] pb-4' : 'max-h-0'}`}>
          <div className="flex flex-col gap-1 pt-2 border-t border-gray-800">
            <Link href="/" className="py-3 px-3 rounded-lg text-gray-100 font-semibold hover:bg-gray-800">Home</Link>
            <Link href="/jobs" className="py-3 px-3 rounded-lg text-gray-100 font-semibold hover:bg-gray-800">Find Work</Link>
            <Link href="/freelancers" className="py-3 px-3 rounded-lg text-gray-100 font-semibold hover:bg-gray-800">Freelancers</Link>

            {profile?.role === 'client' && (
              <>
                <Link href="/post-job" className="py-3 px-3 rounded-lg text-gray-100 font-semibold hover:bg-gray-800">Post a Job</Link>
                <Link href="/proposals" className="py-3 px-3 rounded-lg text-gray-100 font-semibold hover:bg-gray-800">Proposals</Link>
              </>
            )}

            {user ? (
              <>
                <Link href={dashboardLink} className="py-3 px-3 rounded-lg text-gray-100 font-semibold hover:bg-gray-800">Dashboard</Link>
                <Link href="/messages" className="py-3 px-3 rounded-lg text-gray-100 font-semibold hover:bg-gray-800">Messages</Link>
                <Link href="/notifications" className="py-3 px-3 rounded-lg text-gray-100 font-semibold hover:bg-gray-800 flex justify-between">
                  <span>Notifications</span>
                  {unread > 0 && <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1">{unread}</span>}
                </Link>
                <Link href={`/profile/${user.id}`} className="py-3 px-3 rounded-lg text-gray-100 font-semibold hover:bg-gray-800">
                  {profile?.full_name?.split(' ')[0] ?? 'Profile'}
                </Link>
                <button onClick={logout} className="py-3 px-3 rounded-lg text-left text-red-400 font-semibold hover:bg-gray-800">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="py-3 px-3 rounded-lg text-gray-100 font-semibold hover:bg-gray-800">Login</Link>
                <Link href="/register" className="mt-2 bg-amber-500 text-gray-900 text-center py-3 rounded-lg font-bold hover:bg-amber-400">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}