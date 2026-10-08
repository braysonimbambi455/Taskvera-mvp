import Link from 'next/link'
import { CATEGORIES, MOCK_JOBS } from '@/lib/data'

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/25 text-white font-bold px-4 py-1 rounded-full text-sm mb-6">
             Built for university students in Kenya
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
            We Connect You with Skilled Freelancers
          </h1>
          <p className="text-lg md:text-xl text-white font-bold mb-10 max-w-2xl mx-auto">
            Hire talented university students for short gigs — design, voice-overs,
            web development, and more. Students earn while they learn.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/post-job"
              className="bg-white text-blue-800 font-extrabold px-8 py-4 rounded-lg hover:bg-blue-50 transition shadow-md"
            >
              Post a Job
            </Link>
            <Link
              href="/jobs"
              className="border-2 border-white text-white font-extrabold px-8 py-4 rounded-lg hover:bg-white/20 transition"
            >
              Find Work
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
            {[
              { n: '100+', label: 'Students' },
              { n: '120+', label: 'Companies' },
              { n: 'KES 10,000', label: 'Paid Out' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-extrabold text-white">
                  {s.n}
                </div>
                <div className="text-white font-bold text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold text-black text-center mb-3">
          Popular Categories
        </h2>
        <p className="text-center text-black font-bold mb-12">
          Find the right skill for your next task
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/jobs?category=${encodeURIComponent(c.name)}`}
              className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-400 transition bg-white"
            >
              <div className="text-4xl mb-3">{c.icon}</div>
              <h3 className="font-extrabold text-lg text-black">{c.name}</h3>
              <p className="text-black font-bold text-sm">
                {MOCK_JOBS.filter((j) => j.category === c.name).length} open jobs
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* RECENT JOBS */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-black">Recent Jobs</h2>
            <Link
              href="/jobs"
              className="text-blue-700 font-extrabold hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {MOCK_JOBS.slice(0, 4).map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
              >
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded">
                  {job.category}
                </span>
                <h3 className="text-lg font-extrabold text-black mt-3 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-black font-medium text-sm line-clamp-2 mt-2">
                  {job.description}
                </p>
                <div className="flex justify-between mt-4 text-sm">
                  <span className="font-extrabold text-blue-700">
                    KES {job.budget_min.toLocaleString()} –{' '}
                    {job.budget_max.toLocaleString()}
                  </span>
                  <span className="text-black font-bold">{job.posted}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-extrabold text-black text-center mb-12">
          How TaskVera Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Post or Find a Job',
              desc: 'Companies post gigs. Students browse and apply.',
            },
            {
              step: '2',
              title: 'Collaborate & Deliver',
              desc: 'Chat, share files, and complete the work.',
            },
            {
              step: '3',
              title: 'Get Paid via M-Pesa',
              desc: 'Secure payment released on delivery.',
            },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-4 shadow-md">
                {s.step}
              </div>
              <h3 className="font-extrabold text-xl text-black mb-2">
                {s.title}
              </h3>
              <p className="text-black font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Ready to earn while you learn?
        </h2>
        <p className="text-white font-bold mb-8 max-w-xl mx-auto">
          Join thousands of students already earning on TaskVera.
        </p>
        <Link
          href="/register"
          className="bg-white text-blue-700 px-8 py-4 rounded-lg font-extrabold hover:bg-blue-50 transition inline-block shadow-md"
        >
          Get Started — It's Free
        </Link>
      </section>
    </main>
  )
}