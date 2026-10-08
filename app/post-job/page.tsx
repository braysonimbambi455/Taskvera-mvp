'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const CATEGORIES = [
  'Graphic Design',
  'Voice Over',
  'Web Development',
  'Writing',
  'Video Editing',
  'Data Entry',
]

export default function PostJob() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    budget_min: '',
    budget_max: '',
    deadline: '',
    location: 'Remote',
  })

  // Shared styling for all inputs, textareas, and selects
  const inputClass =
    'w-full border-2 border-gray-400 rounded-lg p-3 text-black font-bold placeholder:text-gray-800 placeholder:font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
    })
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Please log in first')
      setLoading(false)
      router.push('/login')
      return
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

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Job posted successfully!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-black mb-2">Post a New Job</h1>
      <p className="text-black font-bold mb-8">
        Find the perfect student for your task in minutes.
      </p>

      <form
        onSubmit={submit}
        className="space-y-5 bg-white border-2 border-gray-200 rounded-2xl p-6"
      >
        {/* Job Title */}
        <div>
          <label className="block font-bold text-black mb-2">Job Title</label>
          <input
            required
            placeholder="e.g., Design a marketing poster"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-bold text-black mb-2">Description</label>
          <textarea
            required
            rows={5}
            placeholder="Describe the job, deliverables, and expectations..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-bold text-black mb-2">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Budget row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-black mb-2">
              Min Budget (KES)
            </label>
            <input
              required
              type="number"
              min="0"
              placeholder="e.g., 3000"
              value={form.budget_min}
              onChange={(e) =>
                setForm({ ...form, budget_min: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block font-bold text-black mb-2">
              Max Budget (KES)
            </label>
            <input
              required
              type="number"
              min="0"
              placeholder="e.g., 6000"
              value={form.budget_max}
              onChange={(e) =>
                setForm({ ...form, budget_max: e.target.value })
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Deadline + Location row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-black mb-2">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block font-bold text-black mb-2">Location</label>
            <input
              placeholder="e.g., Remote or Nairobi"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  )
}