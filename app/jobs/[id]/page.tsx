'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MOCK_JOBS } from '@/lib/data'

export default function JobDetail() {
  const params = useParams()
  const router = useRouter()
  const job = MOCK_JOBS.find(j => j.id === params.id)
  const [showModal, setShowModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [bid, setBid] = useState('')
  const [days, setDays] = useState('')
  const [cover, setCover] = useState('')

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Job not found</h1>
        <Link href="/jobs" className="text-indigo-600">← Back to jobs</Link>
      </div>
    )
  }

  function submitProposal(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setShowModal(false)
      setSubmitted(false)
      setBid(''); setDays(''); setCover('')
      alert('✅ Proposal submitted! (Demo only)')
    }, 800)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/jobs" className="text-indigo-600 text-sm">← Back to jobs</Link>

      <div className="bg-white border rounded-2xl p-8 mt-4">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
            {job.category}
          </span>
          <span className="text-xs text-gray-400">Posted {job.posted}</span>
        </div>

        <h1 className="text-3xl font-bold mt-4">{job.title}</h1>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500">Budget</div>
            <div className="font-semibold text-indigo-600">
              KES {job.budget_min.toLocaleString()} – {job.budget_max.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500">Deadline</div>
            <div className="font-semibold">{job.deadline}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500">Location</div>
            <div className="font-semibold">{job.location}</div>
          </div>
        </div>

        <h2 className="font-semibold text-lg mt-6 mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>

        <div className="border-t mt-8 pt-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="text-xs text-gray-500">Posted by</div>
            <div className="font-semibold">{job.client} · <span className="text-gray-500 text-sm">{job.clientType}</span></div>
          </div>
          <div className="flex gap-3">
            <span className="text-sm text-gray-500 self-center">{job.proposals} proposals</span>
            <button onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Submit Proposal
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Submit Proposal</h2>
            <form onSubmit={submitProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Bid (KES)</label>
                <input required type="number" value={bid}
                  onChange={(e) => setBid(e.target.value)}
                  className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Days</label>
                <input required type="number" value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Letter</label>
                <textarea required rows={5} value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  placeholder="Why are you a good fit?"
                  className="w-full border rounded-lg p-3" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border py-3 rounded-lg">Cancel</button>
                <button type="submit" disabled={submitted}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
                  {submitted ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}