'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { notifyUser } from '@/lib/actions/notify'

export async function releasePayment(contractId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // 1. Verify the contract belongs to this client and is 'delivered'
  const { data: contract } = await supabase
    .from('contracts')
    .select('*, jobs(title), freelancer:freelancer_id(id, total_earnings)')
    .eq('id', contractId)
    .single()

  if (!contract || contract.client_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  if (contract.status !== 'delivered') {
    return { error: 'Contract is not in a delivered state.' }
  }

  // 2. Update contract status to 'paid'
  const { error: contractError } = await supabase
    .from('contracts')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', contractId)

  if (contractError) return { error: contractError.message }

  // 3. Update the freelancer's total earnings
  const currentEarnings = contract.freelancer?.total_earnings || 0
  const newEarnings = currentEarnings + Number(contract.amount)

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ total_earnings: newEarnings })
    .eq('id', contract.freelancer_id)

  if (profileError) {
    console.error("Failed to update earnings:", profileError)
  }

  // 4. Notify the freelancer
  await notifyUser({
    userId: contract.freelancer_id,
    title: 'Payment Released!',
    body: `The client has released payment of KES ${contract.amount} for "${contract.jobs.title}".`,
    link: `/contracts/${contractId}`,
  })

  revalidatePath(`/contracts/${contractId}`)
  revalidatePath('/dashboard/client')
  revalidatePath('/dashboard/freelancer')
  
  return { success: true }
}