'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { toggleUserStatus } from '@/app/admin/actions'
import Link from 'next/link'

export default function UserTable({ users }: { users: any[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'freelancer' | 'client'>('all')
  const [pending, startTransition] = useTransition()

  const filteredUsers = users.filter((u) => {
    if (filter === 'all') return true
    return u.role === filter
  })

  function handleToggle(userId: string, currentStatus: boolean) {
    const action = currentStatus ? 'Deactivate' : 'Activate'
    if (!confirm(`Are you sure you want to ${action} this user?`)) return

    startTransition(async () => {
      const res = await toggleUserStatus(userId, currentStatus)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`User ${action.toLowerCase()}d successfully`)
        router.refresh()
      }
    })
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 flex gap-2 bg-gray-50">
        {(['all', 'freelancer', 'client'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-bold text-sm capitalize transition ${
              filter === f
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {f === 'all' ? 'All Users' : f === 'freelancer' ? 'freelancers' : 'Companies'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-800 font-bold text-sm">
              <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Role</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-black">
                  <Link href={`/profile/${u.id}`} className="hover:text-blue-600 hover:underline">
                    {u.full_name}
                  </Link>
                  {u.role === 'freelancer' && (
                    <div className="text-xs text-gray-500 font-medium">{u.university}</div>
                  )}
                  {u.role === 'client' && (
                    <div className="text-xs text-gray-500 font-medium">{u.company_name}</div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    u.role === 'client' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600 font-medium">{u.email}</td>
                <td className="p-4">
                  <span className={`text-sm font-bold ${u.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {u.is_active ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleToggle(u.id, u.is_active)}
                      disabled={pending}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm ${
                        u.is_active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      } disabled:opacity-50`}
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                  No users found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}