import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatKES, timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function FreelancerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Security check: Kick clients out
  if (profile?.role === 'client') {
    redirect('/dashboard/client')
  }

  // 1. Fetch Proposals
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*, jobs(title, budget_min, budget_max, profiles(full_name, company_name))')
    .eq('freelancer_id', user.id)
    .order('created_at', { ascending: false })

  // 2. Fetch Active Contracts
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, jobs(title, description), profiles!contracts_client_id_fkey(full_name, company_name)')
    .eq('freelancer_id', user.id)
    .order('created_at', { ascending: false })

  // 3. Calculate Stats
  const activeContracts = contracts?.filter(c => c.status === 'active') || []
  const deliveredContracts = contracts?.filter(c => c.status === 'delivered') || []
  const pendingProposals = proposals?.filter(p => p.status === 'pending') || []
  
  const totalEarned = contracts
    ?.filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + Number(c.amount), 0) || 0

  const stats = [
    { label: 'Total Earned', value: formatKES(totalEarned), color: 'text-green-600' },
    { label: 'Active Contracts', value: activeContracts.length, color: 'text-emerald-600' },
    { label: 'Pending Proposals', value: pendingProposals.length, color: 'text-yellow-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Freelancer Dashboard</h1>
          <p className="text-gray-800 font-bold">Welcome back, {profile?.full_name}</p>
        </div>
        <Link 
          href="/jobs" 
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 shadow-md transition"
        >
          Find New Work
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <div className="text-sm font-bold text-gray-600">{stat.label}</div>
            <div className={`text-2xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* ACTIVE CONTRACTS SECTION */}
        <div>
          <h2 className="text-xl font-extrabold text-black mb-4">Active Contracts</h2>
          <div className="space-y-3">
            {activeContracts.map((contract: any) => (
              <Link 
                key={contract.id} 
                href={`/contracts/${contract.id}`}
                className="block border-2 border-blue-200 bg-emerald-50 rounded-lg p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-black text-lg">{contract.jobs?.title}</span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-emerald-600 text-white rounded-md">
                    Active
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-700">
                  Client: {contract.profiles?.company_name || contract.profiles?.full_name}
                </div>
                <div className="text-sm font-extrabold text-emerald-700 mt-2">
                  Amount: {formatKES(contract.amount)}
                </div>
              </Link>
            ))}

            {deliveredContracts.map((contract: any) => (
              <Link 
                key={contract.id} 
                href={`/contracts/${contract.id}`}
                className="block border-2 border-green-200 bg-green-50 rounded-lg p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-black text-lg">{contract.jobs?.title}</span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-green-600 text-white rounded-md">
                    Delivered
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-700">
                  Client: {contract.profiles?.company_name || contract.profiles?.full_name}
                </div>
                <div className="text-sm font-extrabold text-green-700 mt-2">
                  Amount: {formatKES(contract.amount)}
                </div>
              </Link>
            ))}

            {activeContracts.length === 0 && deliveredContracts.length === 0 && (
              <div className="text-center py-10 border-2 border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-600 font-bold mb-2">No active contracts</p>
                <Link href="/jobs" className="text-emerald-600 font-bold hover:underline">Apply for jobs to get hired</Link>
              </div>
            )}
          </div>
        </div>

        {/* PROPOSALS SECTION */}
        <div>
          <h2 className="text-xl font-extrabold text-black mb-4">Recent Proposals</h2>
          <div className="space-y-3">
            {proposals?.slice(0, 5).map((proposal: any) => (
              <Link 
                key={proposal.id} 
                href={`/jobs/${proposal.job_id}`}
                className="block border-2 border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-black">{proposal.jobs?.title}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {proposal.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-600">
                  Bid: {formatKES(proposal.bid_amount)} · {proposal.delivery_days} days
                </div>
                <div className="text-xs font-bold text-gray-500 mt-2">
                  {proposal.jobs?.profiles?.company_name || proposal.jobs?.profiles?.full_name}
                </div>
              </Link>
            ))}

            {proposals?.length === 0 && (
              <div className="text-center py-10 border-2 border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-600 font-bold mb-2">No proposals sent yet</p>
                <Link href="/jobs" className="text-emerald-600 font-bold hover:underline">Browse open jobs</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}