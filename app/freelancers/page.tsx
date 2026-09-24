'use client'
import { useState } from 'react'
import { MOCK_FREELANCERS, CATEGORIES } from '@/lib/data'
import { Star } from 'lucide-react'

export default function Freelancers() {
  const [skill, setSkill] = useState('All')

  const filtered = MOCK_FREELANCERS.filter(f =>
    skill === 'All' || f.skills.includes(skill)
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Browse Freelancers</h1>
      <p className="text-gray-500 mb-8">Hire talented university students for your next project.</p>

      <div className="flex gap-2 mb-8 flex-wrap">
        <button onClick={() => setSkill('All')}
          className={`px-4 py-2 rounded-full text-sm border ${skill === 'All' ? 'bg-indigo-600 text-white border-indigo-600' : ''}`}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c.name} onClick={() => setSkill(c.name)}
            className={`px-4 py-2 rounded-full text-sm border ${skill === c.name ? 'bg-indigo-600 text-white border-indigo-600' : ''}`}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(f => (
          <div key={f.id} className="border rounded-xl p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
                {f.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold">{f.name}</h3>
                <p className="text-xs text-gray-500">{f.university}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{f.rating}</span>
              <span className="text-gray-400">· {f.jobs_done} jobs</span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{f.bio}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {f.skills.map(s => (
                <span key={s} className="text-xs bg-gray-100 px-2 py-1 rounded">{s}</span>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <div>
                <div className="text-xs text-gray-500">Rate</div>
                <div className="font-semibold text-indigo-600">KES {f.hourly_rate}/hr</div>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                Hire
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}