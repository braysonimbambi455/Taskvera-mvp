export type Role = 'student' | 'client' | 'admin'
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'
export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type ContractStatus = 'active' | 'delivered' | 'paid' | 'disputed' | 'cancelled'

export type Profile = {
  id: string
  role: Role
  full_name: string
  email: string
  phone: string | null
  university: string | null
  company_name: string | null
  bio: string | null
  skills: string[] | null
  avatar_url: string | null
  hourly_rate: number | null
  rating: number
  total_earnings: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type Job = {
  id: string
  client_id: string
  title: string
  description: string
  category: string
  budget_min: number
  budget_max: number
  deadline: string | null
  location: string
  status: JobStatus
  attachments: string[] | null
  created_at: string
  updated_at: string
  profiles?: Pick<Profile, 'full_name' | 'company_name' | 'avatar_url' | 'rating'>
}

export type Proposal = {
  id: string
  job_id: string
  student_id: string
  cover_letter: string
  bid_amount: number
  delivery_days: number
  status: ProposalStatus
  created_at: string
  updated_at: string
  profiles?: Pick<Profile, 'full_name' | 'university' | 'avatar_url' | 'rating' | 'skills'>
  jobs?: Pick<Job, 'title' | 'budget_min' | 'budget_max' | 'category' | 'client_id'>
}

export type Contract = {
  id: string
  job_id: string
  proposal_id: string | null
  client_id: string
  student_id: string
  amount: number
  status: ContractStatus
  delivered_at: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
  jobs?: Pick<Job, 'title' | 'description' | 'category'>
}

export type Message = {
  id: string
  contract_id: string
  sender_id: string
  content: string
  attachment_url: string | null
  read: boolean
  created_at: string
}

export type Review = {
  id: string
  contract_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}

export type Payment = {
  id: string
  contract_id: string
  phone: string
  amount: number
  status: 'pending' | 'success' | 'failed' | 'refunded'
  mpesa_receipt: string | null
  checkout_request_id: string | null
  merchant_request_id: string | null
  result_code: number | null
  result_desc: string | null
  created_at: string
  updated_at: string
}

export type Notification = {
  id: string
  user_id: string
  title: string
  body: string | null
  link: string | null
  read: boolean
  created_at: string
}