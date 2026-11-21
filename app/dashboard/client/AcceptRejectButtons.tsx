'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AcceptRejectButtons({ 
  proposalId, 
  onAction 
}: { 
  proposalId: string, 
  onAction: (id: string, status: 'accepted' | 'rejected') => Promise<void> 
}) {
  const [loading, setLoading] = useState(false)

  async function handleAction(status: 'accepted' | 'rejected') {
    setLoading(true)
    try {
      await onAction(proposalId, status)
      toast.success(`Proposal ${status}!`)
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 mt-4 pt-4 border-t-2 border-gray-100">
      <button 
        onClick={() => handleAction('accepted')} 
        disabled={loading}
        className="flex-1 bg-emerald-50 text-emerald-700 border-2 border-emerald-200 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition disabled:opacity-50"
      >
        <CheckCircle className="w-4 h-4" /> Accept
      </button>
      <button 
        onClick={() => handleAction('rejected')} 
        disabled={loading}
        className="flex-1 bg-red-50 text-red-700 border-2 border-red-200 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition disabled:opacity-50"
      >
        <XCircle className="w-4 h-4" /> Reject
      </button>
    </div>
  )
}