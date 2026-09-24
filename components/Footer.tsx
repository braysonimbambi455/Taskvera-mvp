import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-xl font-bold mb-3">TaskVera</h3>
          <p className="text-sm">We Connect You with Skilled Freelancers. Earn while you learn.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">For Students</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/jobs">Find Work</Link></li>
            <li><Link href="/register">Sign Up</Link></li>
            <li><Link href="/freelancers">Browse Talent</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">For Companies</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/post-job">Post a Job</Link></li>
            <li><Link href="/jobs">Browse Jobs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">About</Link></li>
            <li><Link href="/">Contact</Link></li>
            <li><Link href="/">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm">
        © {new Date().getFullYear()} TaskVera. All rights reserved.
      </div>
    </footer>
  )
}