'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import SkillsSelector from '@/components/profile/SkillsSelector'

const MAX_SIZE = 1 * 1024 * 1024 // 1 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

export default function EditProfileForm({
  profile,
  userId,
}: {
  profile: any
  userId: string
}) {
  const supabase = createClient()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    university: profile.university ?? '',
    company_name: profile.company_name ?? '',
    bio: profile.bio ?? '',
    hourly_rate: profile.hourly_rate ?? '',
    portfolio_url: profile.portfolio_url ?? '',
    phone: profile.phone ?? '', // NEW: Phone Number
  })
  
  // Use state array for skills
  const [skills, setSkills] = useState<string[]>(profile.skills ?? [])

  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const inputClass =
    'w-full border-2 border-gray-400 rounded-lg p-3 text-black font-bold placeholder:text-gray-800 placeholder:font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP allowed')
      return
    }
    if (file.size > MAX_SIZE) {
      toast.error('Image must be 1 MB or smaller')
      return
    }

    setUploading(true)

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${userId}/avatar-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { cacheControl: '3600', upsert: true })

    if (uploadError) {
      toast.error(uploadError.message)
      setUploading(false)
      return
    }

    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: pub.publicUrl })
      .eq('id', userId)

    if (updateError) {
      toast.error(updateError.message)
      setUploading(false)
      return
    }

    setAvatarUrl(pub.publicUrl)
    toast.success('Profile picture updated!')
    setUploading(false)
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Validation for freelancers
    if (profile.role === 'freelancer' && skills.length === 0) {
      toast.error('Please select at least one service category.')
      return
    }

    setSaving(true)

    const updates: any = {
      full_name: form.full_name,
      bio: form.bio || null,
      skills: skills.length > 0 ? skills : null,
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      portfolio_url: form.portfolio_url || null,
      phone: form.phone || null, // Save phone number
    }

    if (profile.role === 'freelancer') {
      updates.university = form.university || null
    } else {
      updates.company_name = form.company_name || null
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    setSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Profile saved!')
    router.push(`/profile/${userId}`)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border-2 border-gray-200 rounded-2xl p-6"
    >
      {/* Avatar uploader */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0 border-2 border-blue-300">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-3xl font-bold text-blue-800">
              {form.full_name?.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-800 disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Change Photo'}
          </button>
          <p className="text-sm text-black font-bold mt-2">
            JPG, PNG, or WEBP · Max 1 MB
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatar}
          />
        </div>
      </div>

      {/* Fields */}
      <div>
        <label className="block text-sm font-bold text-black mb-2">
          Full Name
        </label>
        <input
          required
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          placeholder="Your full name"
          className={inputClass}
        />
      </div>

      {profile.role === 'freelancer' ? (
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            University
          </label>
          <input
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
            placeholder="e.g. University of Nairobi"
            className={inputClass}
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Company Name
          </label>
          <input
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            placeholder="e.g. SafariTech Ltd"
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-black mb-2">Bio</label>
        <textarea
          rows={4}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell clients about yourself…"
          className={inputClass}
        />
      </div>

      {profile.role === 'freelancer' && (
        <>
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Services Offered (Select all that apply)
            </label>
            <SkillsSelector selectedSkills={skills} onChange={setSkills} />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Phone Number (M-Pesa)
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="e.g. 0712345678"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Portfolio Website Link (Optional)
            </label>
            <input
              type="url"
              value={form.portfolio_url}
              onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
              placeholder="https://yourportfolio.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Hourly Rate (KES)
            </label>
            <input
              type="number"
              min="0"
              value={form.hourly_rate}
              onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
              placeholder="e.g. 800"
              className={inputClass}
            />
          </div>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 border-2 border-gray-400 py-3 rounded-lg font-bold text-black hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}