import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { timeAgo, formatKES } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['Graphic Design','Voice Over','Web Development','Writing','Video Editing','Data Entry']

export default async function JobsPage({
  searchParams,
}: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category, q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('jobs')
    .select('*, profiles(full_name, company_name, avatar_url, rating)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (q) query = query.ilike('title', `%${q}%`)

  const { data: jobs } = await query

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-black">Browse Jobs</h1>
        <Link href="/post-job" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700">
          + Post a Job
        </Link>
      </div>

      <form className="mb-6 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search jobs..."
          className="flex-1 border-2 border-gray-400 rounded-lg p-3 text-black font-bold" />
        <button className="bg-gray-900 text-white font-bold px-6 rounded-lg">Search</button>
      </form>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link href="/jobs" className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${!category ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-300 text-black'}`}>All</Link>
        {CATEGORIES.map(c => (
          <Link key={c} href={`/jobs?category=${encodeURIComponent(c)}`}
            className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${category === c ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-300 text-black'}`}>
            {c}
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {jobs?.map((job: any) => (
          <Link key={job.id} href={`/jobs/${job.id}`}
            className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg bg-white transition">
            <div className="flex justify-between items-start">
              <span className="text-xs bg-blue-100 text-emerald-800 font-bold px-2 py-1 rounded">
                {job.category}
              </span>
              <span className="text-xs text-gray-500 font-bold">{timeAgo(job.created_at)}</span>
            </div>
            <h2 className="text-xl font-extrabold text-black mt-3">{job.title}</h2>
            <p className="text-gray-700 font-medium line-clamp-2 mt-2 text-sm">{job.description}</p>
            <div className="flex justify-between mt-4 text-sm">
              <span className="font-extrabold text-emerald-700">
                {formatKES(job.budget_min)} – {formatKES(job.budget_max)}
              </span>
              <span className="text-gray-600 font-bold">{job.location}</span>
            </div>
          </Link>
        ))}
        {!jobs?.length && (
          <div className="col-span-2 text-center py-16 text-gray-600 font-bold">
            No jobs found. <Link href="/post-job" className="text-emerald-600">Post the first one!</Link>
          </div>
        )}
      </div>
    </div>
  )
}