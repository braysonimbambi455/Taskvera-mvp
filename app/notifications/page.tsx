import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Mark all as read (fire-and-forget)
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Notifications</h1>
      <p className="text-gray-500 mb-8">
        Updates about your proposals, contracts, and payments.
      </p>

      <div className="space-y-3">
        {notifications?.map((n) => (
          <Link
            key={n.id}
            href={n.link ?? '#'}
            className={`block border rounded-lg p-4 hover:bg-gray-50 ${
              !n.read ? 'bg-indigo-50 border-indigo-200' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-medium">{n.title}</span>
              <span className="text-xs text-gray-400">
                {timeAgo(n.created_at)}
              </span>
            </div>
            {n.body && (
              <p className="text-sm text-gray-600 mt-1">{n.body}</p>
            )}
          </Link>
        ))}
        {!notifications?.length && (
          <div className="text-center py-16 text-gray-500">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  )
}