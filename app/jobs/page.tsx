import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatKES, timeAgo } from '@/lib/utils'
import { Search, MapPin, Calendar, Briefcase } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function JobsPage({ 
  searchParams 
}: { 
  searchParams: { category?: string, search?: string } 
}) {
  const supabase = await createClient()
  
  const categoryFilter = searchParams.category
  const searchQuery = searchParams.search

  // 1. Fetch jobs, join the client's profile
  let query = supabase
    .from('jobs')
    .select('*, profiles!jobs_client_id_fkey(full_name, company_name, avatar_url)')
    .eq('status', 'open') // Only show jobs that are still open
    .order('created_at', { ascending: false })

  // 2. Apply filters if they exist
  if (categoryFilter) {
    query = query.eq('category', categoryFilter)
  }

  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`)
  }

  const { data: jobs, error } = await query

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error loading jobs</h1>
        <p className="text-gray-600 mt-2">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-black mb-4">
          {categoryFilter ? `${categoryFilter} Jobs` : 'Find Work'}
        </h1>
        <p className="text-lg text-gray-800 font-bold max-w-2xl mx-auto">
          Browse the latest open jobs posted by companies across Kenya.
        </p>
        {categoryFilter && (
          <Link href="/jobs" className="text-emerald-600 font-bold hover:underline mt-4 inline-block">
            Clear filter and view all jobs
          </Link>
        )}
      </div>

      {/* Search Bar (Optional UI) */}
      <div className="max-w-2xl mx-auto mb-12">
        <form className="flex gap-2" method="GET" action="/jobs">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              name="search"
              defaultValue={searchQuery}
              placeholder="Search job titles..." 
              className="w-full border-2 border-gray-300 rounded-lg pl-12 pr-4 py-3 font-bold text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-md">
            Search
          </button>
        </form>
      </div>

      {/* Job Grid */}
      {jobs && jobs.length > 0 ? (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 hover:shadow-lg hover:border-emerald-300 transition-all block"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {job.category}
                    </span>
                    <span className="text-sm text-gray-500 font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.location || 'Remote'}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-black mb-2">
                    {job.title}
                  </h3>
                  
                  <p className="text-gray-700 font-medium line-clamp-2 mb-4">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> 
                      {job.profiles?.company_name || job.profiles?.full_name || 'Client'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> 
                      Posted {timeAgo(job.created_at)}
                    </span>
                  </div>
                </div>

                <div className="md:text-right border-t-2 md:border-t-0 md:border-l-2 border-gray-100 pt-4 md:pt-0 md:pl-8 flex flex-col justify-center">
                  <div className="text-xs text-gray-500 font-bold uppercase mb-1">Budget</div>
                  <div className="text-xl font-extrabold text-emerald-700 whitespace-nowrap">
                    KES {formatKES(job.budget_min)} - {formatKES(job.budget_max)}
                  </div>
                  <div className="mt-4 inline-block bg-gray-900 text-white text-sm font-bold px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                    View Job
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-gray-200">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-black mb-2">No jobs found</h3>
          <p className="text-gray-600 font-medium">
            {categoryFilter || searchQuery 
              ? 'Try adjusting your search or filters to find what you are looking for.' 
              : 'There are currently no open jobs on the platform. Check back later!'}
          </p>
        </div>
      )}
    </div>
  )
}