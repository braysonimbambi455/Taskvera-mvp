import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function FreelancersPage() {
  const supabase = await createClient()

  // Fetch all users where the role is 'freelancer' (or 'student' depending on your DB)
  const { data: freelancers, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student') // Change to 'student' if your DB still uses that
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error loading freelancers</h1>
        <p className="text-gray-600 mt-2">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-black mb-4">Browse Freelancers</h1>
        <p className="text-lg text-gray-800 font-bold max-w-2xl mx-auto">
          Discover talented freelancers ready to help you with your next project.
        </p>
      </div>

      {/* Grid */}
      {freelancers && freelancers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <div 
              key={freelancer.id} 
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0 border-2 border-blue-200">
                  {freelancer.avatar_url ? (
                    <Image
                      src={freelancer.avatar_url}
                      alt={freelancer.full_name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-2xl font-extrabold text-blue-700">
                      {freelancer.full_name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-extrabold text-black truncate">
                    {freelancer.full_name}
                  </h2>
                  <p className="text-sm text-gray-600 font-bold flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {freelancer.university || 'Freelancer'}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-lg w-fit">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-black">{freelancer.rating || 0}</span>
                <span className="text-xs text-gray-500 font-bold">({freelancer.total_earnings ? `KES ${freelancer.total_earnings} earned` : 'New'})</span>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-700 font-medium line-clamp-3 mb-4 flex-grow">
                {freelancer.bio || 'No bio provided yet.'}
              </p>

              {/* Skills */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-1">
                  {freelancer.skills && freelancer.skills.length > 0 ? (
                    freelancer.skills.slice(0, 3).map((skill: string) => (
                      <span 
                        key={skill} 
                        className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 font-bold">No skills listed</span>
                  )}
                  {freelancer.skills && freelancer.skills.length > 3 && (
                    <span className="text-xs font-bold text-gray-500 px-2 py-1">
                      +{freelancer.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 mt-auto">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">Rate</div>
                  <div className="text-sm font-extrabold text-blue-700">
                    {freelancer.hourly_rate ? `KES ${freelancer.hourly_rate}/hr` : 'Negotiable'}
                  </div>
                </div>
                <Link 
                  href={`/profile/${freelancer.id}`}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-gray-200">
          <h3 className="text-xl font-bold text-black mb-2">No freelancers found</h3>
          <p className="text-gray-600 font-medium">There are currently no active freelancers on the platform.</p>
        </div>
      )}
    </div>
  )
}