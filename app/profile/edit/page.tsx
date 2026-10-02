import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditProfileForm from '@/components/profile/EditProfileForm'

export const dynamic = 'force-dynamic'

export default async function EditProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/dashboard')

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
      <p className="text-gray-500 mb-8">
        Keep your profile fresh — it's the first thing clients see.
      </p>
      <EditProfileForm profile={profile} userId={user.id} />
    </div>
  )
}