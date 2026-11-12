'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import PasswordInput from '@/components/PasswordInput'

export default function ResetPassword() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    // Check if the user has a valid session (created by the magic link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error('Invalid or expired reset link. Please try again.')
        router.push('/login')
      } else {
        setCheckingSession(false)
      }
    })
  }, [router, supabase])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Password updated successfully! Please log in.')
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-black font-bold">Verifying reset link...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-black">
          Set New Password
        </h1>
        <p className="text-center text-gray-900 font-bold mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="New password (min 6 chars)"
            minLength={6}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <p className="text-center text-gray-900 text-sm mt-6 font-bold">
          <Link href="/login" className="text-blue-700 font-extrabold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}