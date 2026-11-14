import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | TaskVera',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-black mb-4">Privacy Policy</h1>
      <p className="text-gray-600 font-bold mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-8 text-gray-800 font-medium">
        <section>
          <h2 className="text-2xl font-bold text-black mb-3">1. Information We Collect</h2>
          <p>When you register on TaskVera, we collect your name, email address, and role (freelancer or Company). If you are a freelancer, we also collect your university and skills. You may optionally upload a profile picture.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black mb-3">2. How We Use Your Information</h2>
          <p>We use your information to connect freelancers with companies, process payments, facilitate real-time chat, and improve the platform. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black mb-3">3. Data Security</h2>
          <p>Your data is securely stored using Supabase (PostgreSQL) with strict Row Level Security (RLS) policies. Passwords are encrypted and never visible to us.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black mb-3">4. Contact Us</h2>
          <p>If you have questions about this policy, please visit our <Link href="/contact" className="text-blue-600 hover:underline">Contact Page</Link>.</p>
        </section>
      </div>
    </div>
  )
}