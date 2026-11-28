'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { notifyUser } from '@/lib/actions/notify'

export async function markAsDelivered(contractId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Verify ownership
  const { data: contract } = await supabase
    .from('contracts')
    .select('*, jobs(title)')
    .eq('id', contractId)
    .single()

  if (!contract || contract.freelancer_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  // 2. Update contract status to 'delivered'
  const { error: contractError } = await supabase
    .from('contracts')
    .update({ status: 'delivered', delivered_at: new Date().toISOString() })
    .eq('id', contractId)

  if (contractError) return { error: contractError.message }

  // 3. Notify the client
  await notifyUser({
    userId: contract.client_id,
    title: 'Freelancer Marked Job as Delivered',
    body: `The freelancer has marked "${contract.jobs.title}" as delivered. Please review and release payment.`,
    link: `/contracts/${contractId}`,
  })

  revalidatePath('/dashboard/freelancer')
  revalidatePath(`/contracts/${contractId}`)
  return { success: true }
}