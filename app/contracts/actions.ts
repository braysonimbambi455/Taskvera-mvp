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

  if (!contract || contract.client_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  // 2. Update contract status to 'delivered'
  const { error: contractError } = await supabase
    .from('contracts')
    .update({ status: 'delivered', delivered_at: new Date().toISOString() })
    .eq('id', contractId)

  if (contractError) return { error: contractError.message }

  // 3. Update job status to 'completed'
  await supabase
    .from('jobs')
    .update({ status: 'completed' })
    .eq('id', contract.job_id)

  // 4. Notify the freelancer
  await notifyUser({
    userId: contract.student_id,
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

  // 1. Verify ownership
  const { data: contract } = await supabase
    .from('contracts')
    .select('*, jobs(title)')
    .eq('id', contractId)
    .single()

  if (!contract || contract.client_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  // 2. Update contract status to 'cancelled'
  const { error: contractError } = await supabase
    .from('contracts')
    .update({ status: 'cancelled' })
    .eq('id', contractId)

  if (contractError) return { error: contractError.message }

  // 3. Re-open the job (so the client can hire someone else) or cancel it
  await supabase
    .from('jobs')
    .update({ status: 'cancelled' }) // Or 'open' if you want them to re-hire
    .eq('id', contract.job_id)

  // 4. Notify the freelancer
  await notifyUser({
    userId: contract.student_id,
    title: '⚠️ Contract Cancelled',
    body: `The contract for "${contract.jobs.title}" was cancelled by the client. Reason: ${reason}`,
    link: `/contracts/${contractId}`,
  })

  revalidatePath(`/contracts/${contractId}`)
  revalidatePath('/dashboard')
  return { success: true }
}