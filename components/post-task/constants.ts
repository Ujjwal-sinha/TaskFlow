import { FileText, DollarSign, Tag, Eye, Wallet } from "lucide-react"
import { StepConfig } from "./types"

export const STEPS: StepConfig[] = [
  { id: 1, title: "Basic Info", icon: FileText, description: "Enter the core details of your task" },
  { id: 2, title: "Details", icon: Tag, description: "Add skills and supporting files" },
  { id: 3, title: "Budget & Timeline", icon: DollarSign, description: "Set your budget and timeline" },
  { id: 4, title: "Wallet Connect", icon: Wallet, description: "Connect wallet for blockchain escrow" },
  { id: 5, title: "Preview", icon: Eye, description: "Review and post your task" }
]

export const CATEGORIES = [
  "Design",
  "Development", 
  "Writing",
  "Marketing",
  "Video",
  "Audio",
  "Business",
  "Data",
  "Translation",
  "Blockchain",
  "Other",
].sort()

export const SKILLS = [
  "React",
  "Vue.js",
  "Angular", 
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "Ruby",
  "UI/UX Design",
  "Graphic Design",
  "Logo Design",
  "Web Design",
  "Mobile Design",
  "Content Writing",
  "Copywriting",
  "Technical Writing",
  "Blog Writing",
  "SEO",
  "Social Media",
  "Email Marketing",
  "PPC",
  "Content Marketing",
  "Video Editing",
  "Animation",
  "Motion Graphics",
  "3D Modeling",
  "Data Analysis",
  "Machine Learning",
  "Blockchain",
  "Smart Contracts",
].sort()

export const MIN_TITLE_LENGTH = 10
export const MIN_DESCRIPTION_LENGTH = 50
export const MIN_BUDGET = 10
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] 