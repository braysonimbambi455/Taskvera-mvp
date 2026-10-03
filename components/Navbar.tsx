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
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_, s) =>
      setUser(s?.user ?? null)
    )
    return () => sub.subscription.unsubscribe()
  }, [pathname])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  const linkClass = (href: string) =>
    `hover:text-indigo-600 ${
      isActive(href) ? 'text-indigo-600 font-semibold' : ''
    }`

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          TaskVera
        </Link>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>

        <div
          className={`${
            open ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 bg-white md:bg-transparent border-b md:border-0 p-6 md:p-0 gap-4 md:gap-6 md:items-center`}
        >
          {/* Public links */}
          <Link href="/jobs" className={linkClass('/jobs')}>
            Find Work
          </Link>
          <Link href="/freelancers" className={linkClass('/freelancers')}>
            Freelancers
          </Link>

          {/* Client-only links */}
          {profile?.role === 'client' && (
            <>
              <Link href="/post-job" className={linkClass('/post-job')}>
                Post a Job
              </Link>
              <Link href="/proposals" className={linkClass('/proposals')}>
                Proposals
              </Link>
            </>
          )}

          {/* Authenticated links */}
          {user ? (
            <>
              <Link href="/dashboard" className={linkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link href="/messages" className={linkClass('/messages')}>
                Messages
              </Link>

              <Link
                href="/notifications"
                className={`relative hover:text-indigo-600 ${
                  isActive('/notifications') ? 'text-indigo-600' : ''
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>

              <Link
                href={`/profile/${user.id}`}
                className={`hover:text-indigo-600 ${
                  pathname?.startsWith('/profile') ? 'text-indigo-600' : ''
                }`}
              >
                {profile?.full_name?.split(' ')[0] ?? 'Profile'}
              </Link>

              <button onClick={logout} className="text-red-600 text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-600">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}