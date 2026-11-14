'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { markAsDelivered, cancelContract } from '@/app/contracts/actions'
import { CheckCircle, XCircle } from 'lucide-react'

export default function ClientContractActions({ 
  contractId, 
  currentStatus 
}: { 
  contractId: string
  currentStatus: string 
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [reason, setReason] = useState('')

  if (currentStatus === 'delivered' || currentStatus === 'cancelled' || currentStatus === 'paid') {
    return null 
  }

  function handleDeliver() {
    if (!confirm('Are you sure the work is done? This will notify the freelancer.')) return
    startTransition(async () => {
      const res = await markAsDelivered(contractId)
      if (res.error) toast.error(res.error)
      else {
        toast.success('Job marked as delivered!')
        router.refresh()
      }
    })
  }

  function handleCancel(e: React.FormEvent) {
    e.preventDefault()
    if (!reason.trim()) return toast.error('Please provide a reason')
    startTransition(async () => {
      const res = await cancelContract(contractId, reason)
      if (res.error) toast.error(res.error)
      else {
        toast.success('Contract cancelled')
        setShowCancelModal(false)
        router.refresh()
      }
    })
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mt-6">
      <h3 className="font-bold text-black text-lg mb-2">Client Controls</h3>
      <p className="text-sm text-gray-600 font-medium mb-4">
        Has the freelancer completed the work? Or are they failing to deliver?
      </p>
      <div className="flex gap-3 flex-wrap">
        <button onClick={handleDeliver} disabled={pending} className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md disabled:opacity-50">
          <CheckCircle className="w-5 h-5" /> Mark as Done (Delivered)
        </button>
        <button onClick={() => setShowCancelModal(true)} disabled={pending} className="flex items-center gap-2 bg-red-100 text-red-700 px-5 py-3 rounded-lg font-bold hover:bg-red-200 transition disabled:opacity-50">
          <XCircle className="w-5 h-5" /> Cancel Contract
        </button>
      </div>
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-black mb-2">Cancel Contract</h2>
            <p className="text-sm text-gray-600 mb-4">This will cancel the contract and notify the freelancer. Please provide a reason.</p>
            <form onSubmit={handleCancel}>
              <textarea required rows={3} placeholder="e.g., Freelancer did not deliver the work on time..." value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border-2 border-gray-300 rounded-lg p-3 text-black font-medium focus:ring-2 focus:ring-red-500 outline-none mb-4" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCancelModal(false)} className="flex-1 border-2 border-gray-300 py-2 rounded-lg font-bold text-gray-700 hover:bg-gray-50">Go Back</button>
                <button type="submit" disabled={pending} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50">{pending ? 'Cancelling...' : 'Confirm Cancel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}