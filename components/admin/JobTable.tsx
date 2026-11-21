'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { deleteJob } from '@/app/admin/job-actions'
import { Trash2 } from 'lucide-react'

export default function JobTable({ jobs }: { jobs: any[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDelete(jobId: string, jobTitle: string) {
    if (!confirm(`Are you sure you want to delete the job: "${jobTitle}"?\n\nThis cannot be undone.`)) return

    startTransition(async () => {
      const res = await deleteJob(jobId)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Job deleted successfully')
        router.refresh()
      }
    })
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden mt-8">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-bold text-black text-lg">Manage Jobs</h2>
        <p className="text-sm text-gray-600">Review and remove any spam or inappropriate job posts.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-800 font-bold text-sm">
              <th className="p-4 border-b">Job Title</th>
              <th className="p-4 border-b">Client</th>
              <th className="p-4 border-b">Budget</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-black max-w-[250px] truncate">
                  <Link href={`/jobs/${job.id}`} className="hover:text-emerald-600 hover:underline">
                    {job.title}
                  </Link>
                  <div className="text-xs text-gray-500 font-medium mt-1">{job.category}</div>
                </td>
                <td className="p-4 text-sm text-gray-700 font-medium">
                  {job.profiles?.company_name || job.profiles?.full_name || 'Unknown'}
                </td>
                <td className="p-4 text-sm font-bold text-gray-800">
                  KES {job.budget_min.toLocaleString()} - {job.budget_max.toLocaleString()}
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                    job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(job.id, job.title)}
                    disabled={pending}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                  No jobs found on the platform.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}