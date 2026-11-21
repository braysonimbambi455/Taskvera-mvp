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

  // Security check: Ensure only clients can access this page
  if (profile?.role !== 'client') {
    redirect('/dashboard/freelancer')
  }

  // Fetch Jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch Proposals
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*, profiles(full_name, university, rating), jobs!inner(title, client_id)')
    .eq('jobs.client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const openJobs = jobs?.filter(j => j.status === 'open').length ?? 0
  const inProgress = jobs?.filter(j => j.status === 'in_progress').length ?? 0
  const totalProposals = proposals?.length ?? 0

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-black">Client Dashboard</h1>
          <p className="text-gray-800 font-bold">
            Welcome, {profile.company_name || profile.full_name}
          </p>
        </div>
        <Link
          href="/post-job"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transition"
        >
          + Post a New Job
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="border-2 border-gray-200 rounded-xl p-5 bg-white">
          <div className="text-sm font-bold text-gray-600">Open Jobs</div>
          <div className="text-2xl font-extrabold mt-1 text-blue-600">{openJobs}</div>
        </div>
        <div className="border-2 border-gray-200 rounded-xl p-5 bg-white">
          <div className="text-sm font-bold text-gray-600">In Progress</div>
          <div className="text-2xl font-extrabold mt-1 text-yellow-600">{inProgress}</div>
        </div>
        <div className="border-2 border-gray-200 rounded-xl p-5 bg-white">
          <div className="text-sm font-bold text-gray-600">Proposals</div>
          <div className="text-2xl font-extrabold mt-1 text-green-600">{totalProposals}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <div>
          <h2 className="text-xl font-extrabold text-black mb-4">Your Recent Jobs</h2>
          <div className="space-y-3">
            {jobs?.slice(0, 5).map(j => (
              <Link
                key={j.id}
                href={`/jobs/${j.id}`}
                className="block border-2 border-gray-200 rounded-lg p-4 hover:bg-gray-50 bg-white transition"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-black">{j.title}</span>
                  <span className="text-xs text-gray-500 font-bold">{timeAgo(j.created_at)}</span>
                </div>
                <div className="text-sm text-gray-700 font-medium mt-1">
                  {j.category} · {formatKES(j.budget_min)} – {formatKES(j.budget_max)}
                </div>
              </Link>
            ))}
            {!jobs?.length && (
              <p className="text-gray-600 font-bold text-sm">
                No jobs yet. <Link href="/post-job" className="text-blue-600 hover:underline">Post your first job</Link>
              </p>
            )}
          </div>
        </div>

        {/* Recent Proposals */}
        <div>
          <h2 className="text-xl font-extrabold text-black mb-4">Recent Proposals</h2>
          <div className="space-y-3">
            {proposals?.map((p: any) => (
              <div key={p.id} className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-black">{p.profiles?.full_name}</div>
                    <div className="text-xs text-gray-600 font-medium">
                      {p.profiles?.university} · ⭐ {p.profiles?.rating ?? 0}
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-blue-700">
                    {formatKES(p.bid_amount)}
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-bold mt-2">For: {p.jobs?.title}</div>
              </div>
            ))}
            {!proposals?.length && (
              <p className="text-gray-600 font-bold text-sm">No proposals yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}