'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { notifyUser } from './notify'

export async function acceptProposal(proposalId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Load the proposal + job
  const { data: proposal, error: pErr } = await supabase
    .from('proposals')
    .select('*, jobs!inner(id, title, client_id, status, budget_min, budget_max)')
    .eq('id', proposalId)
    .single()

  if (pErr || !proposal) return { error: 'Proposal not found' }

  const job = (proposal as any).jobs
  if (!job || job.client_id !== user.id) {
    return { error: 'You do not own this job' }
  }

  if (proposal.status !== 'pending') {
    return { error: 'Proposal already processed' }
  }

  // 1. Mark this proposal accepted
  const { error: acceptErr } = await supabase
    .from('proposals')
    .update({ status: 'accepted' })
    .eq('id', proposalId)

  if (acceptErr) return { error: acceptErr.message }

  // 2. Reject all other pending proposals for the same job
  const { data: others } = await supabase
    .from('proposals')
    .select('id, student_id')
    .eq('job_id', proposal.job_id)
    .neq('id', proposalId)
    .eq('status', 'pending')

  if (others && others.length > 0) {
    await supabase
      .from('proposals')
      .update({ status: 'rejected' })
      .in('id', others.map((o) => o.id))

    // Notify each rejected student
    await Promise.all(
      others.map((o) =>
        notifyUser({
          userId: o.student_id,
          title: 'Proposal not selected',
          body: `Your proposal for "${job.title}" was not selected.`,
          link: `/jobs/${job.id}`,
        })
      )
    )
  }

  // 3. Create the contract
  const { data: contract, error: contractErr } = await supabase
    .from('contracts')
    .insert({
      job_id: job.id,
      proposal_id: proposalId,
      client_id: job.client_id,
      student_id: proposal.student_id,
      amount: proposal.bid_amount,
      status: 'active',
    })
    .select('id')
    .single()

  if (contractErr) return { error: contractErr.message }

  // 4. Update job status
  await supabase
    .from('jobs')
    .update({ status: 'in_progress' })
    .eq('id', job.id)

  // 5. Notify the accepted student
  await notifyUser({
    userId: proposal.student_id,
    title: '🎉 Your proposal was accepted!',
    body: `You were hired for "${job.title}" at KES ${proposal.bid_amount}.`,
    link: `/contracts/${contract.id}`,
  })

  revalidatePath('/proposals')
  revalidatePath('/dashboard')
  revalidatePath('/jobs')
  revalidatePath(`/jobs/${job.id}`)

  return { ok: true, contractId: contract.id }
}

export async function rejectProposal(proposalId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: proposal, error: pErr } = await supabase
    .from('proposals')
    .select('*, jobs!inner(id, title, client_id)')
    .eq('id', proposalId)
    .single()

  if (pErr || !proposal) return { error: 'Proposal not found' }

  const job = (proposal as any).jobs
  if (!job || job.client_id !== user.id) {
    return { error: 'You do not own this job' }
  }

  if (proposal.status !== 'pending') {
    return { error: 'Proposal already processed' }
  }

  const { error } = await supabase
    .from('proposals')
    .update({ status: 'rejected' })
    .eq('id', proposalId)

  if (error) return { error: error.message }

  await notifyUser({
    userId: proposal.student_id,
    title: 'Proposal not selected',
    body: `Your proposal for "${job.title}" was not selected.`,
    link: `/jobs/${job.id}`,
  })

  revalidatePath('/proposals')
  revalidatePath('/dashboard')

  return { ok: true }
}