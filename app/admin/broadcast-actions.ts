'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendBroadcast(title: string, body: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Verify Admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { error: 'Unauthorized' }

  // 2. Fetch all users
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id')

  if (usersError || !users) return { error: 'Could not fetch users' }

  // 3. Create notifications for everyone
  const notifications = users.map(u => ({
    user_id: u.id,
    title: title,
    body: body,
    link: '/dashboard',
    read: false
  }))

  // Insert them in batches (Supabase can usually handle hundreds at once)
  const { error } = await supabase.from('notifications').insert(notifications)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}