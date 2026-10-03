import { createClient } from '@/lib/supabase/server'

export async function notifyUser({
  userId,
  title,
  body,
  link,
}: {
  userId: string
  title: string
  body?: string
  link?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title,
    body: body ?? null,
    link: link ?? null,
  })

  if (error) {
    console.error('Failed to insert notification:', error.message)
  }
}