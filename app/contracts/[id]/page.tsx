import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Chat from '@/components/chat/Chat'
import ClientContractActions from '@/components/contracts/ClientContractActions'
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
      freelancer:freelancer_id (id, full_name, avatar_url, university)
    `
    )
    .eq('id', id)
    .single()

  if (!contract) notFound()

  const isClient = contract.client_id === user.id
  const isfreelancer = contract.freelancer_id === user.id
  if (!isClient && !isfreelancer) redirect('/dashboard')

  const other = isClient ? (contract as any).freelancer : (contract as any).client
  const otherName = other?.full_name ?? 'User'
  const job = (contract as any).jobs

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link href="/messages" className="text-emerald-600 font-bold text-sm hover:underline">
        ← Back to messages
      </Link>

      {/* Contract Summary Card */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mt-4 mb-6 shadow-sm">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Contract</div>
            <h1 className="text-2xl font-extrabold text-black mt-1">{job?.title ?? 'Project'}</h1>
            <div className="text-sm text-gray-700 font-bold mt-1">
              {job?.category} · Started {timeAgo(contract.created_at)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Amount</div>
            <div className="text-xl font-extrabold text-emerald-700">
              {formatKES(contract.amount)}
            </div>
            <span
              className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                contract.status === 'active'
                  ? 'bg-blue-100 text-emerald-800'
                  : contract.status === 'delivered'
                  ? 'bg-yellow-100 text-yellow-800'
                  : contract.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {contract.status}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Client</div>
            <div className="font-bold text-black text-base">
              {(contract as any).client?.company_name ||
                (contract as any).client?.full_name}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Freelancer</div>
            <div className="font-bold text-black text-base">
              {(contract as any).freelancer?.full_name}
            </div>
          </div>
        </div>
      </div>

      {/* Client Controls (Only visible to the Client) */}
      {isClient && (
        <ClientContractActions 
          contractId={contract.id} 
          currentStatus={contract.status} 
        />
      )}

      {/* Chat Window */}
      <div className="mt-6">
        <Chat
          contractId={contract.id}
          currentUserId={user.id}
          otherName={otherName}
        />
      </div>
    </div>
  )
}