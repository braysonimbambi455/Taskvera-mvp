'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/jobs', label: 'Find Work' },
    { href: '/freelancers', label: 'Freelancers' },
    { href: '/post-job', label: 'Post a Job' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">TaskVera</Link>

        <div className="hidden md:flex gap-6 items-center">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hover:text-indigo-600">{l.label}</Link>
          ))}
          <Link href="/login" className="hover:text-indigo-600">Login</Link>
          <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Sign Up
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4 bg-white">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
          <Link href="/register" onClick={() => setOpen(false)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-center">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  )
}