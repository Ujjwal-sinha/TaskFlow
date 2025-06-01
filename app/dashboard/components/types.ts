export interface Task {
  _id: string
  title: string
  description: string
  category: string
  reward: number
  currency: string
  deadline: string
  location: string
  client: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  applicants: number
  tags: string[]
  status: string
  skills: string[]
}

export interface UserApplication {
  _id: string
  taskId: string
  taskTitle: string
  taskReward: number
  taskCurrency: string
  clientName: string
  clientAvatar: string
  proposal: string
  bidAmount: number
  appliedAt: string
  status: string
  aiAnalysis?: {
    matchScore: number
    reason: string
  }
}

export interface ClientTask {
  _id: string
  title: string
  description: string
  category: string
  reward: number
  currency: string
  deadline: Date
  location: string
  status: string
  applicantCount: number
  applicants: Array<{
    _id: string
    userId: string
    userName: string
    userAvatar?: string
    userRating: number
    appliedAt: Date
    proposal: string
    bidAmount: number
    walletAddress?: string
  }>
  createdAt: Date
}

export interface ClientStats {
  totalTasks: number
  openTasks: number
  inProgressTasks: number
  completedTasks: number
  totalApplicants: number
  totalRewardPosted: number
}

export interface UserStats {
  totalApplications: number
  activeApplications: number
  averageMatchScore: number
  totalEarnings: number
}

export const categories = [
  "All", "Design", "Development", "Writing", "Blockchain", 
  "Video", "Marketing", "Audio", "Business", "Data", "Translation"
]