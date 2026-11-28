import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatKES, timeAgo } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all contracts where the current user is either the client OR the freelancer
  const { data: contracts } = await supabase
    .from('contracts')
    .select(`
      id, status, amount, created_at,
      jobs (title, category),
      client:client_id (id, full_name, company_name, avatar_url),
      freelancer:freelancer_id (id, full_name, avatar_url)
    `)
    .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  // Split contracts into Active and Past
  const activeContracts = contracts?.filter(c => c.status === 'active' || c.status === 'delivered') || []
  const pastContracts = contracts?.filter(c => c.status === 'paid' || c.status === 'cancelled') || []

  const renderContractCard = (c: any) => {
    const isClient = c.client?.id === user.id
    const other = isClient ? c.freelancer : c.client
    const otherName = isClient 
      ? (other?.full_name ?? 'Freelancer') 
      : (other?.company_name || other?.full_name || 'Company')
      
    return (
      <Link
        key={c.id}
        href={`/contracts/${c.id}`}
        className="block border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition bg-white"
      >
        <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{c.jobs?.category}</span>
            <h3 className="font-extrabold text-black text-lg mt-1">{c.jobs?.title}</h3>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            c.status === 'active' ? 'bg-blue-100 text-blue-800' : 
            c.status === 'delivered' ? 'bg-yellow-100 text-yellow-800' :
            c.status === 'paid' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {c.status}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800">
            {otherName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-black">
              {isClient ? 'Freelancer: ' : 'Client: '} {otherName}
            </div>
            <div className="text-xs font-bold text-gray-500">Started {timeAgo(c.created_at)}</div>
          </div>
        </div>

        <div className="flex justify-between items-center border-t-2 border-gray-100 pt-4">
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase">Amount</div>
            <div className="font-extrabold text-blue-700">{formatKES(c.amount)}</div>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 px-3 py-2 rounded-lg">
            <MessageSquare className="w-4 h-4" />
            Open Chat
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-black">My Contracts</h1>
        <p className="text-gray-800 font-bold mt-1">
          Manage your active projects, chat with {user.user_metadata?.role === 'client' ? 'freelancers' : 'clients'}, and view your history.
        </p>
      </div>

      <div className="space-y-10">
        {/* ACTIVE CONTRACTS SECTION */}
        <div>
          <h2 className="text-xl font-extrabold text-black mb-4 flex items-center gap-2">
            Active & Delivered Projects
            <span className="bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full">{activeContracts.length}</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeContracts.map(renderContractCard)}
            {activeContracts.length === 0 && (
              <div className="col-span-full text-center py-10 border-2 border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-600 font-bold mb-2">No active contracts.</p>
                <p className="text-sm text-gray-500 font-medium">Your ongoing projects will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* PAST CONTRACTS SECTION */}
        {pastContracts.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-black mb-4">Past Projects (Completed/Cancelled)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {pastContracts.map(renderContractCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}