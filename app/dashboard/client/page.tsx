import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatKES, timeAgo } from '@/lib/utils'
import AcceptRejectButtons from './AcceptRejectButtons' // We will create this next

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

  // Security check: Ensure only clients can access this page
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

  // 3. Calculate Stats
  const openJobs = jobs?.filter(j => j.status === 'open').length ?? 0
  const inProgressJobs = jobs?.filter(j => j.status === 'in_progress').length ?? 0
  const pendingProposals = proposals?.filter(p => p.status === 'pending').length ?? 0

  const stats = [
    { label: 'Open Jobs', value: openJobs, color: 'text-emerald-600' },
    { label: 'Jobs In Progress', value: inProgressJobs, color: 'text-yellow-600' },
    { label: 'Total Proposals', value: proposals?.length ?? 0, color: 'text-green-600' },
    { label: 'New Proposals', value: pendingProposals, color: 'text-purple-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Client Dashboard</h1>
          <p className="text-gray-800 font-bold">Welcome, {profile?.company_name || profile?.full_name}</p>
        </div>
        <Link
          href="/post-job"
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 shadow-md transition"
        >
          + Post a New Job
        </Link>
      </div>

      {/* Stats Cards */}
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
            <Link href="/jobs" className="text-emerald-600 font-bold hover:underline text-sm">View All</Link>
          </div>
          <div className="space-y-3">
            {jobs?.slice(0, 5).map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block border-2 border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition bg-white"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-black text-lg">{job.title}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    job.status === 'open' ? 'bg-green-100 text-green-800' :
                    job.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-600">
                  {job.category} · {formatKES(job.budget_min)} – {formatKES(job.budget_max)}
                </div>
                <div className="text-xs font-bold text-gray-400 mt-2">
                  Posted {timeAgo(job.created_at)}
                </div>
              </Link>
            ))}
            {jobs?.length === 0 && (
              <div className="text-center py-10 border-2 border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-600 font-bold mb-2">You haven't posted any jobs yet.</p>
                <Link href="/post-job" className="text-emerald-600 font-bold hover:underline">Post your first job</Link>
              </div>
            )}
          </div>
        </div>

        {/* PROPOSALS SECTION */}
        <div>
          <h2 className="text-xl font-extrabold text-black mb-4">Recent Proposals Received</h2>
          <div className="space-y-4">
            {proposals?.map((proposal: any) => (
              <div key={proposal.id} className="border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800">
                      {proposal.profiles?.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-bold text-black">{proposal.profiles?.full_name}</div>
                      <div className="text-xs text-gray-600 font-bold">
                        {proposal.profiles?.university || 'Freelancer'} · ⭐ {proposal.profiles?.rating ?? 0}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                      proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-bold text-gray-700">For: <span className="text-black">{proposal.jobs?.title}</span></div>
                  <div className="text-sm font-bold text-emerald-700 mt-1">Bid: {formatKES(proposal.bid_amount)} ({proposal.delivery_days} days)</div>
                  {proposal.cover_letter && (
                    <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 line-clamp-3 italic">
                      "{proposal.cover_letter}"
                    </div>
                  )}
                </div>

                {/* Accept/Reject Buttons (Only show if pending) */}
                {proposal.status === 'pending' ? (
                  <AcceptRejectButtons proposalId={proposal.id} />
                ) : (
                  <Link 
                    href={`/jobs/${proposal.job_id}`} 
                    className="block text-center mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition"
                  >
                    View Job Details
                  </Link>
                )}
              </div>
            ))}
            {proposals?.length === 0 && (
              <div className="text-center py-10 border-2 border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-600 font-bold mb-2">No proposals received yet.</p>
                <p className="text-sm text-gray-500 font-medium">Freelancers will apply once you post a job.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}