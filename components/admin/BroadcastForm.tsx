'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { sendBroadcast } from '@/app/admin/broadcast-actions'
import { Send } from 'lucide-react'

export default function BroadcastForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return toast.error('Please fill all fields')

    if (!confirm('Are you sure you want to send this announcement to ALL users?')) return

    startTransition(async () => {
      const res = await sendBroadcast(title, body)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Announcement sent to all users!')
        setTitle('')
        setBody('')
        router.refresh()
      }
    })
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-8">
      <div className="mb-4">
        <h2 className="font-bold text-black text-lg">Send Platform Announcement</h2>
        <p className="text-sm text-gray-600">This will send a notification to every registered user.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-black mb-1">Announcement Title</label>
          <input
            required
            placeholder="e.g., TaskVera now supports M-Pesa!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-3 text-black font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-black mb-1">Message Body</label>
          <textarea
            required
            rows={3}
            placeholder="e.g., We are excited to announce..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg p-3 text-black font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-md disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
          {pending ? 'Sending to all users...' : 'Send to All Users'}
        </button>
      </form>
    </div>
  )
}