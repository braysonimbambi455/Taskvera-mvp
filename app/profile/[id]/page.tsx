import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === profile.id

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles!reviews_reviewer_id_fkey(full_name, avatar_url)')
    .eq('reviewee_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white border rounded-2xl p-8">
        <div className="flex items-start gap-6 flex-wrap">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-3xl font-bold text-indigo-700">
                {profile.full_name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-[240px]">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {profile.role === 'student'
                    ? `🎓 ${profile.university ?? 'Student'}`
                    : `🏢 ${profile.company_name ?? 'Company'}`}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{profile.rating ?? 0}</span>
                  <span className="text-gray-400">
                    · {profile.total_earnings ? `KES ${profile.total_earnings}` : 'New'}
                  </span>
                </div>
              </div>

              {isOwner && (
                <Link
                  href="/profile/edit"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {profile.bio && (
              <p className="mt-4 text-gray-700 whitespace-pre-line">{profile.bio}</p>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.skills.map((s: string) => (
                  <span
                    key={s}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {profile.hourly_rate && (
              <div className="mt-4 text-sm">
                <span className="text-gray-500">Rate: </span>
                <span className="font-semibold text-indigo-600">
                  KES {profile.hourly_rate}/hr
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        <div className="space-y-3">
          {reviews?.map((r: any) => (
            <div key={r.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                  {r.profiles?.full_name?.charAt(0) ?? '?'}
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {r.profiles?.full_name ?? 'Anonymous'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {'⭐'.repeat(r.rating)}
                  </div>
                </div>
              </div>
              {r.comment && (
                <p className="mt-3 text-sm text-gray-700">{r.comment}</p>
              )}
            </div>
          ))}
          {!reviews?.length && (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}