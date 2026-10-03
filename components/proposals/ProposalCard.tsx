'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Star, Clock, Calendar } from 'lucide-react'
import { acceptProposal, rejectProposal } from '@/lib/actions/proposals'
import { formatKES, timeAgo } from '@/lib/utils'

export default function ProposalCard({ proposal }: { proposal: any }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  const student = proposal.profiles
  const job = proposal.jobs

  function handleAccept() {
    if (!confirm(`Hire ${student?.full_name} for "${job?.title}"?`)) return

    startTransition(async () => {
      const res = await acceptProposal(proposal.id)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Proposal accepted — contract created!')
      setDone(true)
      router.refresh()
    })
  }

  function handleReject() {
    if (!confirm(`Reject ${student?.full_name}'s proposal?`)) return

    startTransition(async () => {
      const res = await rejectProposal(proposal.id)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Proposal rejected')
      setDone(true)
      router.refresh()
    })
  }

  const statusColor =
    proposal.status === 'pending'
      ? 'bg-yellow-100 text-yellow-700'
      : proposal.status === 'accepted'
      ? 'bg-green-100 text-green-700'
      : proposal.status === 'rejected'
      ? 'bg-red-100 text-red-700'
      : 'bg-gray-100 text-gray-600'

  return (
    <div className="border rounded-xl p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
            {student?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={student.avatar_url}
                alt={student.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              student?.full_name?.charAt(0).toUpperCase() ?? '?'
            )}
          </div>
          <div>
            <Link
              href={`/profile/${proposal.student_id}`}
              className="font-semibold hover:text-indigo-600"
            >
              {student?.full_name ?? 'Freelancer'}
            </Link>
            <div className="text-xs text-gray-500">
              {student?.university ?? 'Student'}
              {student?.rating ? ` · ⭐ ${student.rating}` : ''}
            </div>
          </div>
        </div>

        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}>
          {proposal.status}
        </span>
      </div>

      {/* Job context */}
      {job && (
        <div className="mt-4 text-sm">
          <span className="text-gray-500">For: </span>
          <Link href={`/jobs/${job.id}`} className="font-medium hover:text-indigo-600">
            {job.title}
          </Link>
        </div>
      )}

      {/* Bid + timing */}
      <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500">Bid</div>
          <div className="font-semibold text-indigo-600">
            {formatKES(proposal.bid_amount)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500">Delivery</div>
          <div className="font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> {proposal.delivery_days}d
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500">Sent</div>
          <div className="font-semibold">{timeAgo(proposal.created_at)}</div>
        </div>
      </div>

      {/* Cover letter */}
      <div className="mt-4">
        <div className="text-xs text-gray-500 mb-1">Cover letter</div>
        <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-4">
          {proposal.cover_letter}
        </p>
      </div>

      {/* Actions */}
      {proposal.status === 'pending' && !done && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleReject}
            disabled={pending}
            className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            disabled={pending}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {pending ? 'Processing…' : 'Accept & Hire'}
          </button>
        </div>
      )}

      {proposal.status === 'accepted' && (
        <div className="mt-6 text-sm text-green-700 bg-green-50 rounded-lg p-3">
          ✅ You hired {student?.full_name}.{' '}
          <Link
            href={`/contracts/${proposal.contract_id ?? ''}`}
            className="underline font-medium"
          >
            View contract
          </Link>
        </div>
      )}
    </div>
  )
}