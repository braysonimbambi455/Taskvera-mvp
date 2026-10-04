'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import PasswordInput from '@/components/PasswordInput'

export default function Register() {
  const router = useRouter()
  const supabase = createClient()
  const [role, setRole] = useState<'student' | 'client'>('student')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    university: '',
    company_name: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          role,
          university: role === 'student' ? form.university : null,
          company_name: role === 'client' ? form.company_name : null,
        },
      },
    })

    setLoading(false)

    if (authError) {
      let msg = authError.message
      const lower = authError.message.toLowerCase()

      if (lower.includes('already registered') || lower.includes('already exists')) {
        msg = '⚠️ This email is already registered. Try logging in instead.'
      } else if (lower.includes('password')) {
        msg = '🔒 Password must be at least 6 characters.'
      } else if (lower.includes('valid email')) {
        msg = '📧 Please enter a valid email address.'
      } else if (lower.includes('rate limit')) {
        msg = '⏳ Too many attempts. Try again in a minute.'
      }

      setError(msg)
      toast.error(msg)
      return
    }

    toast.success('Account created!')
    router.push('/dashboard')
    router.refresh()
  }

  const inputClass =
    'w-full border-2 border-gray-400 rounded-lg p-3 text-black font-bold placeholder:text-gray-800 placeholder:font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-black">
          Join TaskVera
        </h1>
        <p className="text-center text-gray-900 font-bold mb-6">
          Create your free account
        </p>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 bg-gray-200 p-1 rounded-lg mb-6">
          {(['student', 'client'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 rounded-md font-bold transition ${
                role === r
                  ? 'bg-white shadow text-blue-700'
                  : 'text-gray-800 hover:text-black'
              }`}
            >
              {r === 'student' ? '🎓 Student' : '🏢 Company'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            placeholder="Full name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className={inputClass}
          />
          <input
            required
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />

          <PasswordInput
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            placeholder="Password (min 6 chars)"
            minLength={6}
            autoComplete="new-password"
            name="new-password"
          />

          {role === 'student' ? (
            <input
              placeholder="University"
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
              className={inputClass}
            />
          ) : (
            <input
              placeholder="Company name"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className={inputClass}
            />
          )}

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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-900 text-sm mt-6 font-bold">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-blue-700 font-extrabold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}