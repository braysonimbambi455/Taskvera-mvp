'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ProposalForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ bid_amount: '', delivery_days: '', cover_letter: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const { error } = await supabase.from('proposals').insert({
      job_id: jobId,
      student_id: user.id,
      bid_amount: Number(form.bid_amount),
      delivery_days: Number(form.delivery_days),
      cover_letter: form.cover_letter,
    })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Proposal submitted!')
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
        Submit Proposal
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-2">Submit Proposal</h2>
            <p className="text-sm text-gray-500 mb-4">For: {jobTitle}</p>
            <form onSubmit={submit} className="space-y-4">
              <input required type="number" placeholder="Your bid (KES)" value={form.bid_amount}
                onChange={(e) => setForm({ ...form, bid_amount: e.target.value })}
                className="w-full border rounded-lg p-3" />
              <input required type="number" placeholder="Delivery days" value={form.delivery_days}
                onChange={(e) => setForm({ ...form, delivery_days: e.target.value })}
                className="w-full border rounded-lg p-3" />
              <textarea required rows={5} placeholder="Why are you a good fit?"
                value={form.cover_letter}
                onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
                className="w-full border rounded-lg p-3" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 border py-3 rounded-lg">Cancel</button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
                  {loading ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}