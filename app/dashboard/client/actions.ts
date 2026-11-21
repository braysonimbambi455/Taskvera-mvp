'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProposalStatus(proposalId: string, newStatus: 'accepted' | 'rejected') {
  const supabase = await createClient()

  // 1. Verify the user is logged in and is a client
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // 2. Fetch the proposal to get the freelancer_id and job title
  const { data: proposal, error: fetchError } = await supabase
    .from('proposals')
    .select('freelancer_id, jobs(title)')
    .eq('id', proposalId)
    .single()

  if (fetchError || !proposal) throw new Error('Proposal not found')

  // 3. Update the proposal status
  const { error: updateError } = await supabase
    .from('proposals')
    .update({ status: newStatus })
    .eq('id', proposalId)

  if (updateError) throw new Error(updateError.message)

  // 4. Send a notification to the freelancer
  const jobTitle = (proposal.jobs as any)?.title || 'a job'
  const notificationTitle = newStatus === 'accepted' ? 'Proposal Accepted! 🎉' : 'Proposal Rejected'
  const notificationMessage = newStatus === 'accepted' 
    ? `Your proposal for "${jobTitle}" was accepted. Check your dashboard for next steps!`
    : `Your proposal for "${jobTitle}" was not accepted this time. Keep applying!`

  await supabase.from('notifications').insert({
    user_id: proposal.freelancer_id,
    title: notificationTitle,
    message: notificationMessage,
    link: '/dashboard/freelancer'
  })

  // 5. Refresh the client dashboard page to reflect changes
  revalidatePath('/dashboard/client')
}