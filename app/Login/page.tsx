import Link from 'next/link'

export default function Login() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="bg-white border rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Coming Soon</h1>
        <p className="text-gray-500 mb-6">
          Full authentication with Supabase is being built.
          For now, explore the demo pages.
        </p>
        <Link href="/jobs" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold inline-block">
          Browse Jobs
        </Link>
      </div>
    </div>
  )
}