'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteJob(jobId: string) {
  const supabase = await createClient()

  // Verify the person is an Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Unauthorized: Only admins can delete jobs' }
  }

  // Delete the job
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}