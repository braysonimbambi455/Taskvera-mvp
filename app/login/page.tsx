'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import PasswordInput from '@/components/PasswordInput'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (authError) {
      // Friendly error messages
      let msg = 'Wrong email or password. Please try again.'
      const lower = authError.message.toLowerCase()

      if (lower.includes('invalid login credentials')) {
        msg = '❌ Wrong email or password.'
      } else if (lower.includes('email not confirmed')) {
        msg = '⚠️ Please verify your email before logging in.'
      } else if (lower.includes('too many requests')) {
        msg = '⏳ Too many attempts. Try again in a minute.'
      } else if (lower.includes('user not found')) {
        msg = '❌ No account found with that email.'
      }

      setError(msg)
      toast.error(msg)
      return
    }

    toast.success('Welcome back!')
    router.push(params.get('redirect') ?? '/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-black">
          Welcome Back
        </h1>
        <p className="text-center text-gray-900 font-bold mb-6">
          Log in to TaskVera
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-400 rounded-lg p-3 text-black font-bold placeholder:text-gray-800 placeholder:font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="Password"
            autoComplete="current-password"
          />

          {error && (
            <div className="bg-red-50 border-2 border-red-400 text-red-800 font-bold text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-gray-900 text-sm mt-6 font-bold">
          No account?{' '}
          <Link
            href="/register"
            className="text-blue-700 font-extrabold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-black font-bold">Loading…</div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}