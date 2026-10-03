import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Chat from '@/components/chat/Chat'
import { formatKES, timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: contract } = await supabase
    .from('contracts')
    .select(
      `
      *,
      jobs (id, title, description, category),
      client:client_id (id, full_name, avatar_url, company_name),
      student:student_id (id, full_name, avatar_url, university)
    `
    )
    .eq('id', id)
    .single()

  if (!contract) notFound()

  const isClient = contract.client_id === user.id
  const isStudent = contract.student_id === user.id
  if (!isClient && !isStudent) redirect('/dashboard')

  const other = isClient ? (contract as any).student : (contract as any).client
  const otherName = other?.full_name ?? 'User'
  const job = (contract as any).jobs

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link href="/messages" className="text-indigo-600 text-sm">
        ← Back to messages
      </Link>

      <div className="bg-white border rounded-2xl p-6 mt-4 mb-6">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <div className="text-xs text-gray-500">Contract</div>
            <h1 className="text-2xl font-bold">{job?.title ?? 'Project'}</h1>
            <div className="text-sm text-gray-500 mt-1">
              {job?.category} · Started {timeAgo(contract.created_at)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Amount</div>
            <div className="text-xl font-bold text-indigo-600">
              {formatKES(contract.amount)}
            </div>
            <span
              className={`inline-block mt-1 text-xs px-3 py-1 rounded-full ${
                contract.status === 'active'
                  ? 'bg-indigo-100 text-indigo-700'
                  : contract.status === 'delivered'
                  ? 'bg-yellow-100 text-yellow-700'
                  : contract.status === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {contract.status}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500">Client</div>
            <div className="font-medium">
              {(contract as any).client?.company_name ??
                (contract as any).client?.full_name}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500">Freelancer</div>
            <div className="font-medium">
              {(contract as any).student?.full_name}
            </div>
          </div>
        </div>
      </div>

      <Chat
        contractId={contract.id}
        currentUserId={user.id}
        otherName={otherName}
      />
    </div>
  )
}