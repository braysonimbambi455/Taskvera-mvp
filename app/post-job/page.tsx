'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const CATEGORIES = ['Graphic Design','Voice Over','Web Development','Writing','Video Editing','Data Entry']

export default function PostJob() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', category: CATEGORIES[0],
    budget_min: '', budget_max: '', deadline: '', location: 'Remote',
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Please log in first')
      return router.push('/login')
    }

    const { error } = await supabase.from('jobs').insert({
      client_id: user.id,
      title: form.title,
      description: form.description,
      category: form.category,
      budget_min: Number(form.budget_min),
      budget_max: Number(form.budget_max),
      deadline: form.deadline || null,
      location: form.location,
    })
    setLoading(false)
    if (error) return toast.error(error.message)
    toast.success('Job posted!')
    router.push('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
      <form onSubmit={submit} className="space-y-5 bg-white border rounded-xl p-6">
        <input required placeholder="Job title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded-lg p-3" />
        <textarea required rows={5} placeholder="Describe the job..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-lg p-3" />
        <select value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border rounded-lg p-3">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input required type="number" placeholder="Min budget (KES)" value={form.budget_min}
            onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
            className="border rounded-lg p-3" />
          <input required type="number" placeholder="Max budget (KES)" value={form.budget_max}
            onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
            className="border rounded-lg p-3" />
        </div>
        <input type="date" value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className="w-full border rounded-lg p-3" />
        <button disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  )
}