import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProposalCard from '@/components/proposals/ProposalCard'

export const dynamic = 'force-dynamic'

export default async function ProposalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Confirm the user is a client
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'client') {
    redirect('/dashboard')
  }

  const { data: proposals } = await supabase
    .from('proposals')
    .select(
      `
      *,
      profiles:student_id (full_name, university, avatar_url, rating),
      jobs!inner (id, title, client_id)
    `
    )
    .eq('jobs.client_id', user.id)
    .order('created_at', { ascending: false })

  const pending = proposals?.filter((p) => p.status === 'pending') ?? []
  const others = proposals?.filter((p) => p.status !== 'pending') ?? []

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-gray-500">
            {pending.length} pending · {others.length} processed
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-indigo-600 font-medium hover:underline"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Pending */}
      <h2 className="text-lg font-semibold mb-4">Awaiting your decision</h2>
      <div className="space-y-5 mb-12">
        {pending.map((p) => (
          <ProposalCard key={p.id} proposal={p} />
        ))}
        {!pending.length && (
          <div className="text-center py-12 border rounded-xl text-gray-500">
            No pending proposals.
          </div>
        )}
      </div>

      {/* Processed */}
      {others.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-4">Already processed</h2>
          <div className="space-y-5 opacity-90">
            {others.map((p) => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}