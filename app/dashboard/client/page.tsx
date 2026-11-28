import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatKES, timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ClientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'client') {
    redirect('/dashboard/freelancer')
  }

  // 1. Fetch Jobs Posted by this Client
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  // 2. Fetch ALL Proposals for this Client's Jobs
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*, profiles(full_name, university, rating, avatar_url), jobs!inner(title, client_id)')
    .eq('jobs.client_id', user.id)
    .order('created_at', { ascending: false })

  // 3. Fetch ACTIVE Contracts (This is what populates "Jobs In Progress")
  const { data: activeContracts } = await supabase
    .from('contracts')
    .select('*, jobs(title, category), freelancer:freelancer_id(full_name, university, avatar_url)')
    .eq('client_id', user.id)
    .eq('status', 'active') // Only get active ones
    .order('created_at', { ascending: false })

  // 4. Calculate Stats
  const openJobs = jobs?.filter(j => j.status === 'open').length ?? 0
  const inProgressJobs = activeContracts?.length ?? 0 // Count active contracts directly
  const pendingProposals = proposals?.filter(p => p.status === 'pending').length ?? 0

  const stats = [
    { label: 'Open Jobs', value: openJobs, color: 'text-blue-600' },
    { label: 'Jobs In Progress', value: inProgressJobs, color: 'text-yellow-600' },
    { label: 'Total Proposals', value: proposals?.length ?? 0, color: 'text-green-600' },
    { label: 'New Proposals', value: pendingProposals, color: 'text-purple-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Client Dashboard</h1>
          <p className="text-gray-800 font-bold">Welcome, {profile?.company_name || profile?.full_name}</p>
        </div>
        <Link href="/post-job" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition">
          + Post a New Job
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm">
            <div className="text-sm font-bold text-gray-600">{stat.label}</div>
            <div className={`text-2xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* POSTED JOBS SECTION */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-extrabold text-black">Your Posted Jobs</h2>
          </div>
          <div className="space-y-3">
            {jobs?.slice(0, 5).map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block border-2 border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition bg-white">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-black text-lg">{job.title}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-600">
                  {job.category} · {formatKES(job.budget_min)} – {formatKES(job.budget_max)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* JOBS IN PROGRESS SECTION (REAL TIME) */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-extrabold text-black">Jobs In Progress</h2>
          </div>
          <div className="space-y-4">
            {activeContracts?.map((contract: any) => (
              <Link key={contract.id} href={`/contracts/${contract.id}`} className="block border-2 border-yellow-200 rounded-xl p-5 bg-yellow-50 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-extrabold text-black text-lg">{contract.jobs?.title}</span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-yellow-200 text-yellow-900">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-yellow-900 text-sm">
                    {contract.freelancer?.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-black">{contract.freelancer?.full_name}</div>
                    <div className="text-xs font-bold text-gray-600">{contract.freelancer?.university}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm font-bold text-gray-700 bg-white p-2 rounded border border-yellow-200">
                  Amount: {formatKES(contract.amount)} · <span className="text-blue-600 underline">Click to Chat</span>
                </div>
              </Link>
            ))}
            {activeContracts?.length === 0 && (
              <div className="text-center py-10 border-2 border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-600 font-bold mb-2">No jobs in progress.</p>
                <p className="text-sm text-gray-500 font-medium">Hire a freelancer from your proposals to start.</p>
              </div>
            )}
          </div>
        </div>

        {/* PROPOSALS SECTION */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-extrabold text-black mb-4">Recent Proposals Received</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {proposals?.slice(0, 6).map((proposal: any) => (
              <div key={proposal.id} className="border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800">
                        {proposal.profiles?.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-bold text-black">{proposal.profiles?.full_name}</div>
                        <div className="text-xs text-gray-600 font-bold">
                          {proposal.profiles?.university || 'Freelancer'} · ⭐ {proposal.profiles?.rating ?? 0}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                      proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-bold text-gray-700">For: <span className="text-black">{proposal.jobs?.title}</span></div>
                    <div className="text-sm font-bold text-blue-700 mt-1">Bid: {formatKES(proposal.bid_amount)} ({proposal.delivery_days} days)</div>
                  </div>
                </div>
                <Link href={`/jobs/${proposal.job_id}`} className={`block text-center py-2 rounded-lg font-bold text-sm transition ${
                    proposal.status === 'pending' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {proposal.status === 'pending' ? 'Review & Hire' : 'View Job Details'}
                </Link>
              </div>
            ))}
            {proposals?.length === 0 && (
              <div className="col-span-full text-center py-10 border-2 border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-600 font-bold mb-2">No proposals received yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}