'use client'

import { Check } from 'lucide-react'

// The exact categories from your TaskVera image
const CATEGORIES = [
  'WordPress Development',
  'Web Development',
  'Shopify Development',
  'Mobile App Development',
  'Ecommerce Development',
  'Chatbot Development',
  'Automation Experts',
  'AI Consultant',
  'Claude Experts',
  'Vibe Coders',
  'Graphic Designers',
  'Web Designers',
  'Video Editors',
  'Photo Editors',
  'Google Ads Experts',
  'SEO Experts',
  'Meta Ads Experts',
  'Social Media Marketers',
  'SEM Specialists',
  'Marketing Strategists',
  'Data Analysis',
  'Business Analysis',
  'Data Entry Specialists',
  'Bookkeepers'
]

export default function SkillsSelector({ 
  selectedSkills, 
  onChange 
}: { 
  selectedSkills: string[]
  onChange: (skills: string[]) => void 
}) {
  
  function toggleSkill(skillName: string) {
    if (selectedSkills.includes(skillName)) {
      onChange(selectedSkills.filter((s) => s !== skillName))
    } else {
      onChange([...selectedSkills, skillName])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border-2 border-gray-300 rounded-lg bg-gray-50">
      {CATEGORIES.map((catName) => {
        const isSelected = selectedSkills.includes(catName)
        return (
          <label 
            key={catName} 
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border-2 transition ${
              isSelected 
                ? 'bg-blue-100 border-emerald-500' 
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={isSelected}
              onChange={() => toggleSkill(catName)}
            />
            <div className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 ${
              isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'
            }`}>
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm font-bold text-black leading-tight">{catName}</span>
          </label>
        )
      })}
    </div>
  )
}