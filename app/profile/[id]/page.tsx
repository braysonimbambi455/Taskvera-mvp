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
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-6 flex-wrap">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-teal-100 flex items-center justify-center flex-shrink-0 border-2 border-teal-300">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-3xl font-extrabold text-teal-800">
                {profile.full_name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-[240px]">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div className="min-w-0">
                {/* NAME — bold black, responsive */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black break-words">
                  {profile.full_name}
                </h1>

                {/* University / Company — bold black */}
                <p className="text-sm sm:text-base font-bold text-black mt-2">
                  {profile.role === 'student'
                    ? `🎓 ${profile.university ?? 'Student'}`
                    : `🏢 ${profile.company_name ?? 'Company'}`}
                </p>

                {/* Rating + earnings — bold dark */}
                <div className="flex items-center gap-2 mt-3 text-sm sm:text-base">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-black">
                    {profile.rating ?? 0}
                  </span>
                  <span className="font-semibold text-gray-800">
                    · {profile.total_earnings ? `KES ${profile.total_earnings}` : 'New'}
                  </span>
                </div>
              </div>

              {isOwner && (
                <Link
                  href="/profile/edit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Bio — bold dark */}
            {profile.bio && (
              <p className="mt-4 text-sm sm:text-base font-medium text-black whitespace-pre-line">
                {profile.bio}
              </p>
            )}

            {/* Skills — teal pills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.skills.map((s: string) => (
                  <span
                    key={s}
                    className="text-xs sm:text-sm font-bold bg-teal-100 text-teal-900 px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Rate — bold, blue accent */}
            {profile.hourly_rate && (
              <div className="mt-4 text-sm sm:text-base">
                <span className="text-black font-bold">Rate: </span>
                <span className="font-extrabold text-blue-700">
                  KES {profile.hourly_rate}/hr
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl sm:text-2xl font-extrabold text-black mb-4">
          Reviews
        </h2>
        <div className="space-y-3">
          {reviews?.map((r: any) => (
            <div
              key={r.id}
              className="border-2 border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-800">
                  {r.profiles?.full_name?.charAt(0) ?? '?'}
                </div>
                <div>
                  <div className="font-bold text-black text-sm sm:text-base">
                    {r.profiles?.full_name ?? 'Anonymous'}
                  </div>
                  <div className="text-xs sm:text-sm text-amber-500">
                    {'⭐'.repeat(r.rating)}
                  </div>
                </div>
              </div>
              {r.comment && (
                <p className="mt-3 text-sm sm:text-base font-medium text-black">
                  {r.comment}
                </p>
              )}
            </div>
          ))}
          {!reviews?.length && (
            <p className="text-black font-bold text-sm sm:text-base">
              No reviews yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}