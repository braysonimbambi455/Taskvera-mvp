import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatKES, timeAgo } from '@/lib/utils'
import ProposalForm from '@/components/ProposalForm'

export const dynamic = 'force-dynamic'

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*, profiles(full_name, company_name, avatar_url, rating, created_at)')
    .eq('id', id)
    .single()

  if (!job) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const { count } = await supabase.from('proposals')
    .select('*', { count: 'exact', head: true }).eq('job_id', id)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/jobs" className="text-indigo-600 text-sm">← Back to jobs</Link>
      <div className="bg-white border rounded-2xl p-8 mt-4">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
            {job.category}
          </span>
          <span className="text-xs text-gray-400">Posted {timeAgo(job.created_at)}</span>
        </div>

        <h1 className="text-3xl font-bold mt-4">{job.title}</h1>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500">Budget</div>
            <div className="font-semibold text-indigo-600">
              {formatKES(job.budget_min)} – {formatKES(job.budget_max)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500">Deadline</div>
            <div className="font-semibold">{job.deadline ?? 'Flexible'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500">Location</div>
            <div className="font-semibold">{job.location}</div>
          </div>
        </div>

        <h2 className="font-semibold text-lg mt-6 mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>

        <div className="border-t mt-8 pt-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="text-xs text-gray-500">Posted by</div>
            <div className="font-semibold">
              {job.profiles?.company_name ?? job.profiles?.full_name}
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-500">{count ?? 0} proposals</span>
            {user ? (
              user.id === job.client_id ? (
                <span className="text-sm text-gray-500">You posted this job</span>
              ) : (
                <ProposalForm jobId={job.id} jobTitle={job.title} />
              )
            ) : (
              <Link href="/login" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold">
                Log in to apply
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}