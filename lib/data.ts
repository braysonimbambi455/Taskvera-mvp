export type Job = {
  id: string
  title: string
  description: string
  category: string
  budget_min: number
  budget_max: number
  deadline: string
  location: string
  client: string
  clientType: 'Company' | 'Startup' | 'NGO'
  posted: string
  proposals: number
}

export type Freelancer = {
  id: string
  name: string
  university: string
  skills: string[]
  rating: number
  jobs_done: number
  hourly_rate: number
  bio: string
}

export const CATEGORIES = [
  { name: 'Graphic Design', icon: '🎨' },
  { name: 'Voice Over', icon: '🎙️' },
  { name: 'Web Development', icon: '💻' },
  { name: 'Writing', icon: '✍️' },
  { name: 'Video Editing', icon: '🎬' },
  { name: 'Data Entry', icon: '📊' },
]

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Design a marketing poster for our product launch',
    description: 'We need a vibrant A3 poster for our new product launch event. Deliverable: print-ready PDF + PNG. Must include logo, tagline, date, venue, and QR code.',
    category: 'Graphic Design',
    budget_min: 3000,
    budget_max: 6000,
    deadline: '2025-08-30',
    location: 'Remote',
    client: 'SafariTech Ltd',
    clientType: 'Company',
    posted: '2d ago',
    proposals: 8,
  },
  {
    id: '2',
    title: 'Record Swahili voice-over for 60-second ad',
    description: 'Looking for a clear, energetic Swahili voice-over artist for a radio ad. Script provided. Need WAV + MP3, 48kHz.',
    category: 'Voice Over',
    budget_min: 2000,
    budget_max: 4000,
    deadline: '2025-08-25',
    location: 'Remote',
    client: 'RadioWave Media',
    clientType: 'Company',
    posted: '5h ago',
    proposals: 3,
  },
  {
    id: '3',
    title: 'Build a simple landing page (Next.js + Tailwind)',
    description: 'Need a single-page marketing site with hero, features, testimonials, and contact form. Figma design provided.',
    category: 'Web Development',
    budget_min: 15000,
    budget_max: 25000,
    deadline: '2025-09-10',
    location: 'Nairobi (Hybrid)',
    client: 'NovaPay',
    clientType: 'Startup',
    posted: '1d ago',
    proposals: 12,
  },
  {
    id: '4',
    title: 'Write 10 blog posts about sustainable farming',
    description: 'SEO-friendly 800-word blog posts. Topics provided. 2 posts per week.',
    category: 'Writing',
    budget_min: 8000,
    budget_max: 12000,
    deadline: '2025-09-15',
    location: 'Remote',
    client: 'GreenGrow Kenya',
    clientType: 'NGO',
    posted: '3d ago',
    proposals: 21,
  },
  {
    id: '5',
    title: 'Edit a 3-minute YouTube video (food vlog)',
    description: 'Trim, color-grade, add captions and background music. Footage provided (1080p).',
    category: 'Video Editing',
    budget_min: 4000,
    budget_max: 7000,
    deadline: '2025-08-28',
    location: 'Remote',
    client: 'TasteBuddy KE',
    clientType: 'Startup',
    posted: '6h ago',
    proposals: 5,
  },
  {
    id: '6',
    title: 'Enter 500 contacts into our CRM from business cards',
    description: 'Manual data entry from scanned business cards. Excel template provided. Accuracy required.',
    category: 'Data Entry',
    budget_min: 1500,
    budget_max: 2500,
    deadline: '2025-08-22',
    location: 'Remote',
    client: 'SalesBoost Africa',
    clientType: 'Company',
    posted: '1d ago',
    proposals: 14,
  },
]

export const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: '1',
    name: 'Amina Wanjiru',
    university: 'University of Nairobi',
    skills: ['Graphic Design', 'Branding', 'Illustrator'],
    rating: 4.9,
    jobs_done: 34,
    hourly_rate: 800,
    bio: 'Third-year design student passionate about bold, African-inspired branding.',
  },
  {
    id: '2',
    name: 'Brian Otieno',
    university: 'JKUAT',
    skills: ['Web Development', 'React', 'Next.js'],
    rating: 4.8,
    jobs_done: 27,
    hourly_rate: 1200,
    bio: 'Full-stack developer building fast, accessible web apps for small businesses.',
  },
  {
    id: '3',
    name: 'Cynthia Mwangi',
    university: 'Strathmore University',
    skills: ['Voice Over', 'Swahili', 'English'],
    rating: 5.0,
    jobs_done: 41,
    hourly_rate: 600,
    bio: 'Radio-trained voice artist. Warm, clear tone for ads and narration.',
  },
  {
    id: '4',
    name: 'David Kimani',
    university: 'Kenyatta University',
    skills: ['Writing', 'SEO', 'Content Strategy'],
    rating: 4.7,
    jobs_done: 52,
    hourly_rate: 500,
    bio: 'Content writer helping brands tell stories that convert.',
  },
  {
    id: '5',
    name: 'Esther Njeri',
    university: 'Moi University',
    skills: ['Video Editing', 'Premiere Pro', 'After Effects'],
    rating: 4.9,
    jobs_done: 19,
    hourly_rate: 900,
    bio: 'Video editor turning raw footage into scroll-stopping stories.',
  },
  {
    id: '6',
    name: 'Faisal Ahmed',
    university: 'Technical University of Kenya',
    skills: ['Data Entry', 'Excel', 'Python'],
    rating: 4.6,
    jobs_done: 44,
    hourly_rate: 400,
    bio: 'Detail-oriented data specialist. Fast, accurate, reliable.',
  },
]