import Link from 'next/link'
import { MOCK_JOBS, MOCK_FREELANCERS } from '@/lib/data'

export default function Dashboard() {
  const stats = [
    { label: 'Active Jobs', value: MOCK_JOBS.length, color: 'text-indigo-600' },
    { label: 'Proposals', value: 23, color: 'text-green-600' },
    { label: 'In Progress', value: 3, color: 'text-yellow-600' },
    { label: 'Earnings', value: 'KES 45K', color: 'text-purple-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back! Here's your activity overview.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="border rounded-xl p-5">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Jobs</h2>
            <Link href="/jobs" className="text-indigo-600 text-sm">View all</Link>
          </div>
          <div className="space-y-3">
            {MOCK_JOBS.slice(0, 4).map(j => (
              <Link key={j.id} href={`/jobs/${j.id}`}
                className="block border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <span className="font-medium">{j.title}</span>
                  <span className="text-xs text-gray-400">{j.posted}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {j.category} · KES {j.budget_min.toLocaleString()}+
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Top Freelancers</h2>
            <Link href="/freelancers" className="text-indigo-600 text-sm">View all</Link>
          </div>
          <div className="space-y-3">
            {MOCK_FREELANCERS.slice(0, 4).map(f => (
              <div key={f.id} className="border rounded-lg p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {f.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-gray-500">{f.skills[0]} · ⭐ {f.rating}</div>
                </div>
                <div className="text-sm font-semibold text-indigo-600">
                  KES {f.hourly_rate}/hr
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-2">This is a demo preview</h3>
        <p className="text-indigo-100 mb-4">
          Full authentication, M-Pesa payments, real-time chat, and contracts are coming soon.
        </p>
        <Link href="/post-job" className="bg-white text-indigo-700 px-6 py-2 rounded-lg font-semibold">
          Try Posting a Job
        </Link>
      </div>
    </div>
  )
}