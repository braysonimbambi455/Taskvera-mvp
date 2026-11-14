import Link from 'next/link'

export const metadata = {
  title: 'About Us | TaskVera',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-6">About TaskVera</h1>
        <p className="text-xl text-gray-700 font-bold max-w-2xl mx-auto">
          Bridging the gap between talented university freelancers and businesses that need short-term gigs done.
        </p>
      </div>

      <div className="space-y-12 text-gray-800 font-medium">
        <section className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-4">Our Mission</h2>
          <p className="text-lg">
            TaskVera was built to solve two problems: companies struggle to find affordable, high-quality talent for short tasks, and university freelancers struggle to find flexible work that fits around their class schedules. We connect the two, allowing freelancers to earn while they learn, and businesses to get work done efficiently.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black mb-4">How We Do It</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-black mb-2">For freelancers</h3>
              <p>Build your profile, showcase your skills, browse short jobs, and get paid securely via M-Pesa.</p>
            </div>
            <div className="border border-gray-200 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-black mb-2">For Companies</h3>
              <p>Post a job, review proposals from talented freelancers, chat in real-time, and hire with confidence.</p>
            </div>
          </div>
        </section>
        
        <div className="text-center mt-12">
          <Link 
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Join TaskVera Today
          </Link>
        </div>
      </div>
    </div>
  )
}