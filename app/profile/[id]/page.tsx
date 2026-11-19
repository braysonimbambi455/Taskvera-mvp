import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Briefcase } from 'lucide-react'

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

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-6 flex-wrap">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0 border-2 border-blue-300">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt={profile.full_name} width={96} height={96} className="object-cover w-full h-full" />
            ) : (
              <span className="text-3xl font-extrabold text-blue-800">
                {profile.full_name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-[240px]">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black break-words">
                  {profile.full_name}
                </h1>
                <p className="text-sm sm:text-base font-bold text-black mt-2">
                  {profile.role === 'freelancer'
                    ? `💼 ${profile.university ?? 'Freelancer'}`
                    : `🏢 ${profile.company_name ?? 'Company'}`}
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm sm:text-base">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-black">{profile.rating ?? 0}</span>
                </div>
              </div>

              {isOwner && (
                <Link href="/profile/edit" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md">
                  Edit Profile
                </Link>
              )}
            </div>

            {profile.bio && (
              <p className="mt-4 text-sm sm:text-base font-medium text-black whitespace-pre-line">
                {profile.bio}
              </p>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.skills.map((s: string) => (
                  <span key={s} className="text-xs sm:text-sm font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {profile.portfolio_url && profile.role === 'freelancer' && (
                <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-800 transition shadow-sm">
                  <Briefcase className="w-4 h-4" /> View Portfolio
                </a>
              )}
              {profile.hourly_rate && (
                <div className="text-sm sm:text-base">
                  <span className="text-black font-bold">Rate: </span>
                  <span className="font-extrabold text-blue-700">KES {profile.hourly_rate}/hr</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}