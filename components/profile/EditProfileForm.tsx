'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

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
    skills: (profile.skills ?? []).join(', '),
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (!ALLOWED.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP allowed')
      return
    }
    if (file.size > MAX_SIZE) {
      toast.error('Image must be 1 MB or smaller')
      return
    }

    setUploading(true)

    // Path: <userId>/avatar-<timestamp>.<ext>
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
    setSaving(true)

    const updates: any = {
      full_name: form.full_name,
      bio: form.bio || null,
     skills: form.skills
  ? form.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
  : null,
      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
    }

    if (profile.role === 'student') {
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-2xl p-6">
      {/* Avatar uploader */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-3xl font-bold text-indigo-700">
              {form.full_name?.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Change Photo'}
          </button>
          <p className="text-xs text-gray-500 mt-2">
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
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          required
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="w-full border rounded-lg p-3"
        />
      </div>

      {profile.role === 'student' ? (
        <div>
          <label className="block text-sm font-medium mb-1">University</label>
          <input
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
            className="w-full border rounded-lg p-3"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            className="w-full border rounded-lg p-3"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          rows={4}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell clients about yourself…"
          className="w-full border rounded-lg p-3"
        />
      </div>

      {profile.role === 'student' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">
              Skills (comma separated)
            </label>
            <input
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="e.g. Graphic Design, Illustrator, Branding"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Hourly Rate (KES)
            </label>
            <input
              type="number"
              min="0"
              value={form.hourly_rate}
              onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
              className="w-full border rounded-lg p-3"
            />
          </div>
        </>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 border py-3 rounded-lg font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}