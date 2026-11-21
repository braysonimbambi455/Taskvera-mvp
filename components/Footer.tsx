import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-xl font-extrabold mb-3">Task<span className="text-blue-400">Vera</span></h3>
          <p className="text-sm font-medium">We Connect You with Skilled Freelancers. Earn while you learn.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">For Freelancers</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><Link href="/jobs" className="hover:text-white transition-colors">Find Work</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">For Companies</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><Link href="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
            <li><Link href="/freelancers" className="hover:text-white transition-colors">Browse Talent</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Company</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6 text-center text-sm font-medium">
        © {new Date().getFullYear()} TaskVera. All rights reserved.
      </div>
    </footer>
  )
}