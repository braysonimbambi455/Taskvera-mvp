'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check } from 'lucide-react'

export default function SkillsSelector({ 
  selectedSkills, 
  onChange 
}: { 
  selectedSkills: string[]
  onChange: (skills: string[]) => void 
}) {
  const supabase = createClient()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      setCategories(data || [])
      setLoading(false)
    })
  }, [])

  function toggleSkill(skillName: string) {
    if (selectedSkills.includes(skillName)) {
      onChange(selectedSkills.filter((s) => s !== skillName))
    } else {
      onChange([...selectedSkills, skillName])
    }
  }

  if (loading) return <div className="text-sm font-bold text-gray-500">Loading skills...</div>

  return (
    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border-2 border-gray-300 rounded-lg bg-gray-50">
      {categories.map((cat) => {
        const isSelected = selectedSkills.includes(cat.name)
        return (
          <label 
            key={cat.id} 
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border-2 transition ${
              isSelected 
                ? 'bg-blue-100 border-blue-500' 
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={isSelected}
              onChange={() => toggleSkill(cat.name)}
            />
            <div className={`w-5 h-5 rounded flex items-center justify-center border ${
              isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
            }`}>
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm font-bold text-black leading-tight">{cat.name}</span>
          </label>
        )
      })}
    </div>
  )
}