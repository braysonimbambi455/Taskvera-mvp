import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatKES, timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // ---------------- CLIENT DASHBOARD ----------------
  if (profile?.role === 'client') {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false })

    const { data: proposals } = await supabase
      .from('proposals')
      .select('*, profiles(full_name, university, rating), jobs!inner(title, client_id)')
      .eq('jobs.client_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    const openJobs = jobs?.filter(j => j.status === 'open').length ?? 0
    const inProgress = jobs?.filter(j => j.status === 'in_progress').length ?? 0
    const totalProposals = proposals?.length ?? 0
    const totalSpent = 0 // TODO: sum from payments

    const stats = [
      { label: 'Open Jobs', value: openJobs, color: 'text-indigo-600' },
      { label: 'In Progress', value: inProgress, color: 'text-yellow-600' },
      { label: 'Proposals', value: totalProposals, color: 'text-green-600' },
      { label: 'Total Spent', value: formatKES(totalSpent), color: 'text-purple-600' },
    ]

    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Client Dashboard</h1>
            <p className="text-gray-500">Welcome, {profile.full_name}</p>
          </div>
          <Link
            href="/post-job"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            + Post a Job
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(s => (
            <div key={s.label} className="border rounded-xl p-5 bg-white">
              <div className="text-sm text-gray-500">{s.label}</div>
              <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Your Recent Jobs</h2>
            <div className="space-y-3">
              {jobs?.slice(0, 5).map(j => (
                <Link
                  key={j.id}
                  href={`/jobs/${j.id}`}
                  className="block border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{j.title}</span>
                    <span className="text-xs text-gray-400">{timeAgo(j.created_at)}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {j.category} · {formatKES(j.budget_min)}–{formatKES(j.budget_max)}
                  </div>
                </Link>
              ))}
              {!jobs?.length && (
                <p className="text-gray-500 text-sm">
                  No jobs yet. <Link href="/post-job" className="text-indigo-600">Post your first job</Link>
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Recent Proposals</h2>
            <div className="space-y-3">
              {proposals?.map((p: any) => (
                <div key={p.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{p.profiles?.full_name}</div>
                      <div className="text-xs text-gray-500">
                        {p.profiles?.university} · ⭐ {p.profiles?.rating ?? 0}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-indigo-600">
                      {formatKES(p.bid_amount)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">For: {p.jobs?.title}</div>
                </div>
              ))}
              {!proposals?.length && (
                <p className="text-gray-500 text-sm">No proposals yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------------- STUDENT DASHBOARD ----------------
  const { data: myProposals } = await supabase
    .from('proposals')
    .select('*, jobs(title, category, budget_min, budget_max, client_id, profiles(full_name, company_name))')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  const { data: myContracts } = await supabase
    .from('contracts')
    .select('*, jobs(title)')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  const pending = myProposals?.filter(p => p.status === 'pending').length ?? 0
  const accepted = myProposals?.filter(p => p.status === 'accepted').length ?? 0
  const active = myContracts?.filter(c => c.status === 'active').length ?? 0
  const earned = profile?.total_earnings ?? 0

  const stats = [
    { label: 'Pending', value: pending, color: 'text-yellow-600' },
    { label: 'Accepted', value: accepted, color: 'text-green-600' },
    { label: 'Active Contracts', value: active, color: 'text-indigo-600' },
    { label: 'Earned', value: formatKES(earned), color: 'text-purple-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-500">Welcome, {profile?.full_name}</p>
        </div>
        <Link
          href="/jobs"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          Find Work
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="border rounded-xl p-5 bg-white">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Your Proposals</h2>
          <div className="space-y-3">
            {myProposals?.map((p: any) => (
              <Link
                key={p.id}
                href={`/jobs/${p.job_id}`}
                className="block border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{p.jobs?.title}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      p.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : p.status === 'accepted'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Bid: {formatKES(p.bid_amount)} · {p.delivery_days} days
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {p.jobs?.profiles?.company_name ?? p.jobs?.profiles?.full_name}
                </div>
              </Link>
            ))}
            {!myProposals?.length && (
              <p className="text-gray-500 text-sm">
                No proposals yet. <Link href="/jobs" className="text-indigo-600">Browse jobs</Link>
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Your Contracts</h2>
          <div className="space-y-3">
            {myContracts?.map(c => (
              <Link
                key={c.id}
                href={`/contracts/${c.id}`}
                className="block border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{(c as any).jobs?.title}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      c.status === 'active'
                        ? 'bg-indigo-100 text-indigo-700'
                        : c.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Amount: {formatKES(c.amount)}
                </div>
              </Link>
            ))}
            {!myContracts?.length && (
              <p className="text-gray-500 text-sm">No contracts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}