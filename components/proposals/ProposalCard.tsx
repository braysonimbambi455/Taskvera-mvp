'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Clock } from 'lucide-react'
import { acceptProposal, rejectProposal } from '@/lib/actions/proposals'
import { formatKES, timeAgo } from '@/lib/utils'

export default function ProposalCard({ proposal }: { proposal: any }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  const freelancer = proposal.profiles
  const job = proposal.jobs

  function handleAccept() {
    if (!confirm(`Hire ${freelancer?.full_name} for "${job?.title}"?`)) return

    startTransition(async () => {
      const res = await acceptProposal(proposal.id)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success('Proposal accepted — contract created!')
      setDone(true)
      router.refresh() // Refreshes the page to fetch the new contract_id
    })
  }

  function handleReject() {
    if (!confirm(`Reject ${freelancer?.full_name}'s proposal?`)) return

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
      ? 'bg-yellow-100 text-yellow-800'
      : proposal.status === 'accepted'
      ? 'bg-green-100 text-green-800'
      : proposal.status === 'rejected'
      ? 'bg-red-100 text-red-800'
      : 'bg-gray-100 text-gray-800'

  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center font-extrabold text-blue-800 text-lg">
            {freelancer?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={freelancer.avatar_url}
                alt={freelancer.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              freelancer?.full_name?.charAt(0).toUpperCase() ?? '?'
            )}
          </div>
          <div>
            <Link
              href={`/profile/${proposal.freelancer_id}`}
              className="font-extrabold text-black hover:text-blue-600 text-lg"
            >
              {freelancer?.full_name ?? 'Freelancer'}
            </Link>
            <div className="text-xs text-gray-600 font-bold mt-1">
              {freelancer?.university ?? 'Freelancer'}
              {freelancer?.rating ? ` · ⭐ ${freelancer.rating}` : ''}
            </div>
          </div>
        </div>

        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${statusColor}`}>
          {proposal.status}
        </span>
      </div>

      {/* Job context */}
      {job && (
        <div className="mt-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
          <span className="text-gray-600 font-bold">For: </span>
          <Link href={`/jobs/${job.id}`} className="font-bold text-black hover:text-blue-600 hover:underline">
            {job.title}
          </Link>
        </div>
      )}

      {/* Bid + timing */}
      <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bid</div>
          <div className="font-extrabold text-blue-700 mt-1">
            {formatKES(proposal.bid_amount)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Delivery</div>
          <div className="font-bold text-black mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {proposal.delivery_days} days
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sent</div>
          <div className="font-bold text-black mt-1">{timeAgo(proposal.created_at)}</div>
        </div>
      </div>

      {/* Cover letter */}
      <div className="mt-4">
        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Cover letter</div>
        <p className="text-sm text-gray-800 font-medium whitespace-pre-line line-clamp-4 bg-gray-50 p-3 rounded-lg italic">
          "{proposal.cover_letter}"
        </p>
      </div>

      {/* Actions */}
      {proposal.status === 'pending' && !done && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleReject}
            disabled={pending}
            className="flex-1 border-2 border-red-200 text-red-600 py-2 rounded-lg font-bold hover:bg-red-50 disabled:opacity-50 transition"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            disabled={pending}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-md"
          >
            {pending ? 'Processing…' : 'Accept & Hire'}
          </button>
        </div>
      )}

      {/* Accepted State - Links to the specific contract if available, else the list */}
      {proposal.status === 'accepted' && (
        <div className="mt-6 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center flex-wrap gap-2">
          <span className="font-bold">✅ You hired {freelancer?.full_name}.</span>
          <Link
            href={proposal.contract_id ? `/contracts/${proposal.contract_id}` : '/contracts'}
            className="bg-white text-green-700 px-4 py-2 rounded-md font-bold shadow-sm hover:bg-green-100 transition border border-green-200"
          >
            View Contract
          </Link>
        </div>
      )}
    </div>
  )
}