'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { notifyUser } from '@/lib/actions/notify'

export async function markAsDelivered(contractId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: contract } = await supabase.from('contracts').select('*, jobs(title)').eq('id', contractId).single()
  if (!contract || contract.client_id !== user.id) return { error: 'Unauthorized' }

  await supabase.from('contracts').update({ status: 'delivered', delivered_at: new Date().toISOString() }).eq('id', contractId)
  await supabase.from('jobs').update({ status: 'completed' }).eq('id', contract.job_id)

  await notifyUser({
    userId: contract.freelancer_id,
    title: '🎉 Job Marked as Delivered',
    body: `The client has marked the job "${contract.jobs.title}" as delivered.`,
    link: `/contracts/${contractId}`,
  })

  revalidatePath(`/contracts/${contractId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function cancelContract(contractId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: contract } = await supabase.from('contracts').select('*, jobs(title)').eq('id', contractId).single()
  if (!contract || contract.client_id !== user.id) return { error: 'Unauthorized' }

  // 1. Cancel the contract
  await supabase.from('contracts').update({ status: 'cancelled' }).eq('id', contractId)
  
  // 2. Re-open the job so the client can hire someone else
  await supabase.from('jobs').update({ status: 'open' }).eq('id', contract.job_id)

  // 3. Notify the freelancer who was cancelled
  await notifyUser({
    userId: contract.freelancer_id,
    title: '⚠️ Contract Cancelled',
    body: `The contract for "${contract.jobs.title}" was cancelled by the client. Reason: ${reason}`,
    link: `/contracts/${contractId}`,
  })

  revalidatePath(`/contracts/${contractId}`)
  revalidatePath('/dashboard')
  revalidatePath('/proposals') // Refresh proposals page so they can hire someone else
  return { success: true }
}