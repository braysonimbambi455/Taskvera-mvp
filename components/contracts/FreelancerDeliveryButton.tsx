'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { markAsDelivered } from '@/app/dashboard/freelancer/actions'
import { CheckCircle } from 'lucide-react'

export default function FreelancerDeliveryButton({ contractId }: { contractId: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDeliver() {
    if (!confirm('Are you sure you want to mark this job as delivered? The client will be notified to release payment.')) return

    startTransition(async () => {
      const res = await markAsDelivered(contractId)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Job marked as delivered! Waiting for client review.')
        router.refresh()
      }
    })
  }

  return (
    <button
      onClick={handleDeliver}
      disabled={pending}
      className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md disabled:opacity-50"
    >
      <CheckCircle className="w-5 h-5" />
      {pending ? 'Updating...' : 'Mark as Delivered'}
    </button>
  )
}