'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_JOBS, CATEGORIES } from '@/lib/data'

export default function JobsPage() {
  const [category, setCategory] = useState<string>('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return MOCK_JOBS.filter(j => {
      const matchCat = category === 'All' || j.category === category
      const matchQuery = j.title.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQuery
    })
  }, [category, query])

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <h1 className="text-3xl font-bold">Browse Jobs</h1>
        <Link href="/post-job" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          + Post a Job
        </Link>
      </div>

      <input
        placeholder="Search jobs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded-lg p-3 mb-6"
      />

      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setCategory('All')}
          className={`px-4 py-2 rounded-full text-sm border ${category === 'All' ? 'bg-indigo-600 text-white border-indigo-600' : ''}`}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c.name}
            onClick={() => setCategory(c.name)}
            className={`px-4 py-2 rounded-full text-sm border ${category === c.name ? 'bg-indigo-600 text-white border-indigo-600' : ''}`}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`}
            className="border rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition">
            <div className="flex justify-between items-start">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                {job.category}
              </span>
              <span className="text-xs text-gray-400">{job.posted}</span>
            </div>
            <h2 className="text-xl font-semibold mt-3">{job.title}</h2>
            <p className="text-gray-600 line-clamp-2 mt-2 text-sm">{job.description}</p>
            <div className="flex justify-between mt-4 text-sm">
              <span className="font-semibold text-indigo-600">
                KES {job.budget_min.toLocaleString()} – {job.budget_max.toLocaleString()}
              </span>
              <span className="text-gray-500">{job.location}</span>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
              <span>Posted by {job.client}</span>
              <span>{job.proposals} proposals</span>
            </div>
          </Link>
        ))}
        {!filtered.length && (
          <div className="col-span-2 text-center py-16 text-gray-500">
            No jobs match your search.
          </div>
        )}
      </div>
    </div>
  )
}