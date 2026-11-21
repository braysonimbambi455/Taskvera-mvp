'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function PostJob() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  
  // Default to the first category
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    category: 'Web Development', 
    budget_min: '', 
    budget_max: '', 
    deadline: '', 
    location: 'Remote' 
  })

  const inputClass = 'w-full border-2 border-gray-400 rounded-lg p-3 text-black font-bold focus:outline-none focus:ring-2 focus:ring-blue-500'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (!data.user) router.push('/login') })
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const { error } = await supabase.from('jobs').insert({
      client_id: user.id, 
      title: form.title, 
      description: form.description,
      category: form.category, 
      budget_min: Number(form.budget_min),
      budget_max: Number(form.budget_max), 
      deadline: form.deadline || null, 
      location: form.location,
    })
    
    setLoading(false)
    if (error) return toast.error(error.message)
    
    toast.success('Job posted successfully!')
    // Force a hard reload to ensure dashboard updates
    window.location.href = '/dashboard'
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-black mb-8">Post a New Job</h1>
      
      <form onSubmit={submit} className="space-y-5 bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Job Title</label>
          <input required placeholder="e.g. Need a WordPress expert to fix my theme" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
          <textarea required rows={5} placeholder="Describe the project, deliverables, and requirements..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Category / Expertise Area</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
            
            <optgroup label="Development & Technology">
              <option value="WordPress Development">WordPress Development</option>
              <option value="Web Development">Web Development</option>
              <option value="Shopify Development">Shopify Development</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="Ecommerce Development">Ecommerce Development</option>
            </optgroup>

            <optgroup label="Automation & AI Solutions">
              <option value="Chatbot Development">Chatbot Development</option>
              <option value="Automation Experts">Automation Experts</option>
              <option value="AI Consultant">AI Consultant</option>
              <option value="Claude Experts">Claude Experts</option>
              <option value="Vibe Coders">Vibe Coders</option>
            </optgroup>

            <optgroup label="Creative & Media">
              <option value="Graphic Designers">Graphic Designers</option>
              <option value="Web Designers">Web Designers</option>
              <option value="Video Editors">Video Editors</option>
              <option value="Photo Editors">Photo Editors</option>
            </optgroup>

            <optgroup label="Digital Marketing & Advertising">
              <option value="Google Ads Experts">Google Ads Experts</option>
              <option value="SEO Experts">SEO Experts</option>
              <option value="Meta Ads Experts">Meta Ads Experts</option>
              <option value="Social Media Marketers">Social Media Marketers</option>
              <option value="SEM Specialists">SEM Specialists</option>
              <option value="Marketing Strategists">Marketing Strategists</option>
            </optgroup>

            <optgroup label="Data & Business Intelligence">
              <option value="Data Analysis">Data Analysis</option>
              <option value="Business Analysis">Business Analysis</option>
              <option value="Data Entry Specialists">Data Entry Specialists</option>
              <option value="Bookkeepers">Bookkeepers</option>
            </optgroup>

          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Min Budget (KES)</label>
            <input required type="number" placeholder="e.g. 5000" value={form.budget_min} onChange={(e) => setForm({ ...form, budget_min: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Max Budget (KES)</label>
            <input required type="number" placeholder="e.g. 15000" value={form.budget_max} onChange={(e) => setForm({ ...form, budget_max: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Deadline (Optional)</label>
          <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={inputClass} />
        </div>

        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-md mt-4">
          {loading ? 'Posting Job...' : 'Post Job'}
        </button>
      </form>
    </div>
  )
}