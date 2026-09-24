'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORIES } from '@/lib/data'

export default function PostJob() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', description: '', category: CATEGORIES[0].name,
    budget_min: '', budget_max: '', deadline: '', location: 'Remote',
  })
  const [loading, setLoading] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('✅ Job posted! (Demo only — not saved)')
      router.push('/jobs')
    }, 800)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
      <p className="text-gray-500 mb-8">Find the perfect student for your task in minutes.</p>

      <form onSubmit={submit} className="space-y-5 bg-white border rounded-2xl p-6">
        <div>
          <label className="block font-medium mb-2">Job Title</label>
          <input required placeholder="e.g., Design a marketing poster"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg p-3" />
        </div>

        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea required rows={5}
            placeholder="Describe the job, deliverables, and expectations..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg p-3" />
        </div>

        <div>
          <label className="block font-medium mb-2">Category</label>
          <select value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border rounded-lg p-3">
            {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Min Budget (KES)</label>
            <input required type="number" min="0" value={form.budget_min}
              onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
              className="w-full border rounded-lg p-3" />
          </div>
          <div>
            <label className="block font-medium mb-2">Max Budget (KES)</label>
            <input required type="number" min="0" value={form.budget_max}
              onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
              className="w-full border rounded-lg p-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Deadline</label>
            <input type="date" value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border rounded-lg p-3" />
          </div>
          <div>
            <label className="block font-medium mb-2">Location</label>
            <input value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border rounded-lg p-3" />
          </div>
        </div>

        <button disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  )
}