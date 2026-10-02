'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, Bell } from 'lucide-react'
import type { Profile } from '@/types/database'

export default function Navbar() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: p } = await supabase
          .from('profiles').select('*').eq('id', data.user.id).single()
        setProfile(p)
        const { count } = await supabase.from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', data.user.id).eq('read', false)
        setUnread(count ?? 0)
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">TaskVera</Link>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>

        <div className={`${open ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 bg-white md:bg-transparent border-b md:border-0 p-6 md:p-0 gap-4 md:gap-6 md:items-center`}>
          <Link href="/jobs" className="hover:text-indigo-600">Find Work</Link>
          <Link href="/freelancers" className="hover:text-indigo-600">Freelancers</Link>
          {profile?.role === 'client' && (
            <Link href="/post-job" className="hover:text-indigo-600">Post a Job</Link>
          )}
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
              <Link href="/messages" className="hover:text-indigo-600">Messages</Link>
              <Link href="/notifications" className="relative hover:text-indigo-600">
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </Link>
              <Link href={`/profile/${user.id}`} className="hover:text-indigo-600">
                {profile?.full_name?.split(' ')[0] ?? 'Profile'}
              </Link>
              <button onClick={logout} className="text-red-600 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-600">Login</Link>
              <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}