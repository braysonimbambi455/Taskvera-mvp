'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const redirectTo = `${window.location.origin}/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    setSuccess(true)
    toast.success('Reset link sent! Check your email.')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-black">
          Forgot Password?
        </h1>
        <p className="text-center text-gray-900 font-bold mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        {success ? (
          <div className="bg-green-50 border-2 border-green-400 text-green-800 font-bold text-sm rounded-lg p-4 text-center">
            If an account exists for <b>{email}</b>, a password reset link has been sent. Please check your inbox (and spam folder).
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input
              required
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-400 rounded-lg p-3 text-black font-bold placeholder:text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-md"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-900 text-sm mt-6 font-bold">
          Remembered it?{' '}
          <Link href="/login" className="text-emerald-700 font-extrabold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}