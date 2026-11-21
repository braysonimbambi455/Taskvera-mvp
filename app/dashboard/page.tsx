import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Force this page to always check the live session
export const dynamic = 'force-dynamic'

export default async function DashboardRouter() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. If no user is logged in, send to login
  if (!user) redirect('/login')

  // 2. Fetch the role from the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // 3. Route based on role
  if (profile?.role === 'client' || profile?.role === 'company') {
    redirect('/dashboard/client')
  } else {
    // Anything else (freelancer, student, admin, null) goes to the freelancer dashboard
    redirect('/dashboard/freelancer')
  }
}