import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UserTable from '@/components/admin/UserTable'
import JobTable from '@/components/admin/JobTable'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verify the user is an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard') // Kick non-admins out
  }

  // Fetch all users
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch all jobs (with client name)
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*, profiles!jobs_client_id_fkey(full_name, company_name)')
    .order('created_at', { ascending: false })

  if (usersError || jobsError) {
    return <div className="p-12 text-center text-red-600 font-bold">Error loading data.</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-black">Admin Panel</h1>
        <p className="text-gray-600 font-bold mt-1">
          Manage users and moderate jobs on the platform.
        </p>
      </div>

      {/* Users Section */}
      <UserTable users={users ?? []} />

      {/* Jobs Section */}
      <JobTable jobs={jobs ?? []} />
    </div>
  )
}