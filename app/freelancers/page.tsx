import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function FreelancersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; skill?: string }>
}) {
  const { q, skill } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('id, full_name, university, skills, rating, hourly_rate, bio, avatar_url, total_earnings')
    .eq('role', 'student')
    .order('rating', { ascending: false })

  if (q) query = query.ilike('full_name', `%${q}%`)
  if (skill) query = query.contains('skills', [skill])

  const { data: freelancers, error } = await query

  // Get the distinct skill list for the filter bar
  const { data: allSkillsRaw } = await supabase
    .from('profiles')
    .select('skills')
    .eq('role', 'student')

  const allSkills: string[] = Array.from(
    new Set(
      (allSkillsRaw ?? [])
        .flatMap((r) => r.skills ?? [])
        .filter(Boolean)
    )
  ).sort()

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Freelancers</h1>
        <p className="text-gray-500">
          {freelancers?.length ?? 0} talented student{freelancers?.length === 1 ? '' : 's'} ready to work
        </p>
      </div>

      {/* Search */}
      <form className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name…"
          className="flex-1 border rounded-lg p-3"
        />
        <button className="bg-gray-900 text-white px-6 rounded-lg">Search</button>
      </form>

      {/* Skill filters */}
      {allSkills.length > 0 && (
        <div className="flex gap-2 mb-8 flex-wrap">
          <Link
            href="/freelancers"
            className={`px-4 py-2 rounded-full text-sm border ${
              !skill ? 'bg-indigo-600 text-white border-indigo-600' : ''
            }`}
          >
            All
          </Link>
          {allSkills.map((s: string) => (
            <Link
              key={s}
              href={`/freelancers?skill=${encodeURIComponent(s)}`}
              className={`px-4 py-2 rounded-full text-sm border ${
                skill === s ? 'bg-indigo-600 text-white border-indigo-600' : ''
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-600 mb-4">Error: {error.message}</p>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {freelancers?.map((f) => (
          <Link
            key={f.id}
            href={`/profile/${f.id}`}
            className="border rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition bg-white"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0">
                {f.avatar_url ? (
                  <Image
                    src={f.avatar_url}
                    alt={f.full_name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-xl font-bold text-indigo-700">
                    {f.full_name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{f.full_name}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {f.university ?? 'Student'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{f.rating ?? 0}</span>
              {(f.total_earnings ?? 0) > 0 && (
                <span className="text-gray-400">
                  · KES {(f.total_earnings ?? 0).toLocaleString()} earned
                </span>
              )}
            </div>

            {f.bio && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{f.bio}</p>
            )}

            {f.skills && f.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {f.skills.slice(0, 4).map((s: string) => (
                  <span key={s} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {s}
                  </span>
                ))}
                {f.skills.length > 4 && (
                  <span className="text-xs text-gray-400">
                    +{f.skills.length - 4} more
                  </span>
                )}
              </div>
            )}

            <div className="border-t pt-4">
              {f.hourly_rate ? (
                <div className="text-sm">
                  <span className="text-gray-500">Rate: </span>
                  <span className="font-semibold text-indigo-600">
                    KES {f.hourly_rate}/hr
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-400">Rate: Negotiable</div>
              )}
            </div>
          </Link>
        ))}

        {!freelancers?.length && (
          <div className="col-span-full text-center py-16 text-gray-500">
            <p className="mb-2">No freelancers found yet.</p>
            <p className="text-sm">
              Students who sign up will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}