import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // List contracts the user is part of — chats happen per contract
  const { data: contracts } = await supabase
    .from('contracts')
    .select(
      `
      id, status, amount, created_at,
      jobs (title, category),
      client:client_id (id, full_name, avatar_url),
      student:student_id (id, full_name, avatar_url)
    `
    )
    .or(`client_id.eq.${user.id},student_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Messages</h1>
      <p className="text-gray-500 mb-8">
        Conversations tied to your active contracts.
      </p>

      <div className="space-y-3">
        {contracts?.map((c: any) => {
          const other =
            c.client?.id === user.id ? c.student : c.client
          const jobTitle = c.jobs?.title ?? 'Contract'
          return (
            <Link
              key={c.id}
              href={`/contracts/${c.id}`}
              className="block border rounded-xl p-4 hover:bg-gray-50 bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                    {other?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={other.avatar_url}
                        alt={other.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      other?.full_name?.charAt(0).toUpperCase() ?? '?'
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{other?.full_name ?? 'User'}</div>
                    <div className="text-xs text-gray-500">{jobTitle}</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                  {c.status}
                </span>
              </div>
            </Link>
          )
        })}

        {!contracts?.length && (
          <div className="text-center py-16 border rounded-xl text-gray-500">
            <p className="mb-2">No conversations yet.</p>
            <p className="text-sm">
              Once a client hires a freelancer, their contract chat appears here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}