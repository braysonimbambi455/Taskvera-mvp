import Link from 'next/link'
import { MOCK_JOBS } from '@/lib/data'
import { 
  Code2, 
  Bot, 
  Palette, 
  Megaphone, 
  BarChart3, 
  CheckCircle2 
} from 'lucide-react'

export default function Home() {
  
  // The 5 categories from your image
  const expertiseAreas = [
    {
      title: "Development & Technology Solutions",
      icon: <Code2 className="w-6 h-6 text-white" />,
      items: ["WordPress Development", "Web Development", "Shopify Development", "Mobile App Development", "Ecommerce Development"]
    },
    {
      title: "Automation & AI Solutions",
      icon: <Bot className="w-6 h-6 text-white" />,
      items: ["Chatbot Development", "Automation Experts", "AI Consultant", "Claude Experts", "Vibe Coders"]
    },
    {
      title: "Creative & Media Solutions",
      icon: <Palette className="w-6 h-6 text-white" />,
      items: ["Graphic Designers", "Web Designers", "Video Editors", "Photo Editors"]
    },
    {
      title: "Digital Marketing & Advertising",
      icon: <Megaphone className="w-6 h-6 text-white" />,
      items: ["Google Ads Experts", "SEO Experts", "Meta Ads Experts", "Social Media Marketers", "SEM Specialists", "Marketing Strategists"]
    },
    {
      title: "Data & Business Intelligence",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      items: ["Data Analysis", "Business Analysis", "Data Entry Specialists", "Bookkeepers"]
    }
  ]

  return (
    <main>
      {/* HERO */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/25 text-white font-bold px-4 py-1 rounded-full text-sm mb-6">
             Built for top freelancers in Kenya
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
            We Connect You with Skilled Freelancers
          </h1>
          <p className="text-lg md:text-xl text-white font-bold mb-10 max-w-2xl mx-auto">
            Hire talented freelancers for short gigs — design, voice-overs,
            web development, and more. Work on your own terms.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/post-job"
              className="bg-white text-emerald-800 font-extrabold px-8 py-4 rounded-lg hover:bg-emerald-50 transition shadow-md"
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
              { n: '100+', label: 'Freelancers' },
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

      {/* EXPERTISE & SERVICE AREAS */}
      <section className="bg-gray-50 py-20 border-b-4 border-emerald-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black uppercase tracking-wide">
              Expertise & Service Areas
            </h2>
            <p className="text-emerald-800 font-bold mt-2 text-lg">
              Technology | Marketing | Data | Creative | Business Support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertiseAreas.map((cat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="bg-emerald-800 p-4 flex items-center gap-3">
                  <div className="bg-emerald-600 p-2 rounded-lg">
                    {cat.icon}
                  </div>
                  <h3 className="text-white font-extrabold text-sm md:text-base leading-tight uppercase">
                    {cat.title}
                  </h3>
                </div>
                
                {/* List Items */}
                <div className="p-6 bg-emerald-50/30">
                  <ul className="space-y-3">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <Link href={`/freelancers?category=${encodeURIComponent(item)}`} className="hover:text-emerald-700 hover:underline">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT JOBS */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-black">Recent Jobs</h2>
            <Link
              href="/jobs"
              className="text-emerald-700 font-extrabold hover:underline"
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
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
                  {job.category}
                </span>
                <h3 className="text-lg font-extrabold text-black mt-3 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-black font-medium text-sm line-clamp-2 mt-2">
                  {job.description}
                </p>
                <div className="flex justify-between mt-4 text-sm">
                  <span className="font-extrabold text-emerald-700">
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
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-black text-center mb-12">
            How TaskVera Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Post or Find a Job',
                desc: 'Companies post gigs. Freelancers browse and apply.',
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
              <div 
                key={s.step} 
                className="text-center bg-white p-8 rounded-2xl border-2 border-gray-300 shadow-sm"
              >
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-4 shadow-md">
                  {s.step}
                </div>
                <h3 className="font-extrabold text-xl text-black mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-800 font-medium text-base">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-700 text-white py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Ready to start earning?
        </h2>
        <p className="text-white font-bold mb-8 max-w-xl mx-auto">
          Join thousands of freelancers already earning on TaskVera.
        </p>
        <Link
          href="/register"
          className="bg-white text-emerald-800 px-8 py-4 rounded-lg font-extrabold hover:bg-emerald-50 transition inline-block shadow-md"
        >
          Get Started — It's Free
        </Link>
      </section>
    </main>
  )
}