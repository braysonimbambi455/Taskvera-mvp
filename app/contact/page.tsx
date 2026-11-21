import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Contact Us | TaskVera',
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-black mb-4">Contact Us</h1>
      <p className="text-gray-700 font-bold mb-12">
        Have a question, feedback, or need help with your account? We'd love to hear from you.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form (Visual) */}
        <div className="bg-white border-2 border-gray-200 p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-black mb-4">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">Name</label>
              <input type="text" placeholder="Your name" className="w-full border-2 border-gray-300 rounded-lg p-3 text-black font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Email</label>
              <input type="email" placeholder="you@example.com" className="w-full border-2 border-gray-300 rounded-lg p-3 text-black font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">Message</label>
              <textarea rows={4} placeholder="How can we help?" className="w-full border-2 border-gray-300 rounded-lg p-3 text-black font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"></textarea>
            </div>
            <button type="button" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="space-y-6">
          <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl">
            <Mail className="w-6 h-6 text-emerald-600 mt-1" />
            <div>
              <h3 className="font-bold text-black">Email</h3>
              <p className="text-gray-700 font-medium">support@marketnest.co.ke</p>
              <p className="text-gray-500 text-sm mt-1">We aim to reply within 24 hours.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl">
            <Phone className="w-6 h-6 text-emerald-600 mt-1" />
            <div>
              <h3 className="font-bold text-black">Phone</h3>
              <p className="text-gray-700 font-medium">0796 135 006</p>
              <p className="text-gray-700 font-medium">0790846942</p>
              <p className="text-gray-500 text-sm mt-1">Mon-Fri from 8am to 5pm.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl">
            <MapPin className="w-6 h-6 text-emerald-600 mt-1" />
            <div>
              <h3 className="font-bold text-black">Office</h3>
              <p className="text-gray-700 font-medium">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}