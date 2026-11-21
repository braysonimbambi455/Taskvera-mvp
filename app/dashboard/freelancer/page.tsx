import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatKES, timeAgo } from '@/lib/utils'
import { CheckCircle, XCircle } from 'lucide-react'

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
  if (profile?.role !== 'freelancer') {
    redirect('/dashboard/client')
  }

  // 1. Fetch Proposals (Simplified to prevent silent crashes)
  const { data: proposals, error: propError } = await supabase
    .from('proposals')
    .select('*, jobs(title, budget_min, budget_max)') // Removed profiles(...) here
    .eq('freelancer_id', user.id)
    .order('created_at', { ascending: false })

  if (propError) {
    console.error("Error fetching proposals:", propError.message)
  }

  // 2. Fetch Active Contracts
  const { data: contracts, error: contractError } = await supabase
    .from('contracts')
    .select('*, jobs(title, description)') // Removed nested profiles join here too
    .eq('freelancer_id', user.id)
    .order('created_at', { ascending: false })

  if (contractError) {
    console.error("Error fetching contracts:", contractError.message)
  }

  // 3. Fetch Notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // 4. Calculate Stats
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

      {/* NOTIFICATIONS ALERT */}
      {notifications && notifications.length > 0 && (
        <div className="mb-8 space-y-3">
          {notifications.map((note) => (
            <div 
              key={note.id} 
              className={`border-l-4 p-4 rounded-r-lg shadow-sm flex justify-between items-start ${
                note.title.includes('Accepted') 
                  ? 'bg-emerald-50 border-emerald-500' 
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex items-start gap-3">
                {note.title.includes('Accepted') ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-bold ${
                    note.title.includes('Accepted') ? 'text-emerald-900' : 'text-red-900'
                  }`}>{note.title}</h3>
                  <p className={`text-sm mt-1 ${
                    note.title.includes('Accepted') ? 'text-emerald-800' : 'text-red-800'
                  }`}>{note.message}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-500">{timeAgo(note.created_at)}</span>
            </div>
          ))}
        </div>
      )}

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
                className="block border-2 border-emerald-200 bg-emerald-50 rounded-lg p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-black text-lg">{contract.jobs?.title || 'Contract'}</span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-emerald-600 text-white rounded-md">
                    Active
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-700">
                  Client Project
                </div>
                <div className="text-sm font-extrabold text-emerald-700 mt-2">
                  Amount: {formatKES(contract.amount || 0)}
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
                  <span className="font-bold text-black text-lg">{contract.jobs?.title || 'Contract'}</span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-green-600 text-white rounded-md">
                    Delivered
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-700">
                  Client Project
                </div>
                <div className="text-sm font-extrabold text-green-700 mt-2">
                  Amount: {formatKES(contract.amount || 0)}
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
                  <span className="font-bold text-black">{proposal.jobs?.title || 'Job'}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {proposal.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-600">
                  Bid: {formatKES(proposal.bid_amount || 0)} · {proposal.delivery_days || 0} days
                </div>
                <div className="text-xs font-bold text-gray-500 mt-2">
                  Client Project
                </div>
              </Link>
            ))}

            {!proposals?.length && (
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