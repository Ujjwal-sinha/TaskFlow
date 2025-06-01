"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/custom/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  AlertCircle,
  Search,
  Loader2,
  Send,
  User,
  Briefcase,
  Target
} from "lucide-react"
import { useUser } from "@civic/auth-web3/react"
import { useTaskEscrow } from "@/hooks/useTaskEscrow"
import { useToast } from "@/hooks/use-toast"
import { TaskCard } from "@/components/custom/task-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserApplication {
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

interface Task {
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

const categories = ["All", "Design", "Development", "Writing", "Blockchain", "Video", "Marketing", "Audio", "Business", "Data", "Translation"]

// Mock data
const stats = [
  {
    title: "Total Earnings",
    value: "$12,450",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-apple-green",
  },
  {
    title: "Active Tasks",
    value: "8",
    change: "+2",
    icon: Clock,
    color: "text-apple-blue",
  },
  {
    title: "Completed Tasks",
    value: "47",
    change: "+5",
    icon: CheckCircle,
    color: "text-apple-purple",
  },
  {
    title: "Rating",
    value: "4.9",
    change: "+0.1",
    icon: Star,
    color: "text-apple-yellow",
  },
]

const tasks = [
  {
    id: "1",
    title: "Design Mobile App Interface",
    client: "TechCorp Inc.",
    status: "In Progress",
    progress: 75,
    deadline: "2024-01-15",
    budget: 800,
    escrowStatus: "Funded",
  },
  {
    id: "2",
    title: "Build React Dashboard",
    client: "StartupXYZ",
    status: "Pending Review",
    progress: 100,
    deadline: "2024-01-10",
    budget: 1200,
    escrowStatus: "Pending Release",
  },
  {
    id: "3",
    title: "Content Writing for Blog",
    client: "ContentCorp",
    status: "In Progress",
    progress: 40,
    deadline: "2024-01-20",
    budget: 300,
    escrowStatus: "Funded",
  },
  {
    id: "4",
    title: "Logo Design Project",
    client: "BrandCo",
    status: "Completed",
    progress: 100,
    deadline: "2024-01-05",
    budget: 500,
    escrowStatus: "Released",
  },
]

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "In Progress":
//       return "bg-apple-blue text-white"
//     case "Pending Review":
//       return "bg-apple-orange text-white"
//     case "Completed":
//       return "bg-apple-green text-white"
//     default:
//       return "bg-muted text-muted-foreground"
//   }
// }

// const getEscrowColor = (status: string) => {
//   switch (status) {
//     case "Funded":
//       return "text-apple-green"
//     case "Pending Release":
//       return "text-apple-orange"
//     case "Released":
//       return "text-apple-blue"
//     default:
//       return "text-muted-foreground"
//   }
// }

export default function DashboardPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected, currentAccount, connect } = useTaskEscrow(
    process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS
  )

  // Available Tasks State
  const [availableTasks, setAvailableTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [tasksError, setTasksError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  // User Applications State
  const [userApplications, setUserApplications] = useState<UserApplication[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)

  // Stats State
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeApplications: 0,
    averageMatchScore: 0,
    totalEarnings: 0
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
      toast({
        title: "Authentication Required",
        description: "Please sign in to access your dashboard",
        variant: "destructive"
      })
    }
  }, [user, isLoading, router, toast])

  // Fetch available tasks
  const fetchAvailableTasks = async () => {
    try {
      setTasksLoading(true)
      setTasksError(null)

      const params = new URLSearchParams({
        sortBy,
        limit: '12'
      })

      if (selectedCategory !== "All") {
        params.append('category', selectedCategory)
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }

      const response = await fetch(`/api/tasks?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()
      setAvailableTasks(data.tasks || [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setTasksError('Failed to load tasks')
    } finally {
      setTasksLoading(false)
    }
  }

  // Fetch user applications
  const fetchUserApplications = async () => {
    if (!currentAccount) return

    try {
      setApplicationsLoading(true)
      
      const response = await fetch(`/api/users/${currentAccount}/applications`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      setUserApplications(data.applications || [])
      setStats(data.stats || {
        totalApplications: 0,
        activeApplications: 0,
        averageMatchScore: 0,
        totalEarnings: 0
      })
    } catch (err) {
      console.error('Error fetching applications:', err)
      // Set empty state on error
      setUserApplications([])
      setStats({
        totalApplications: 0,
        activeApplications: 0,
        averageMatchScore: 0,
        totalEarnings: 0
      })
    } finally {
      setApplicationsLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailableTasks()
  }, [selectedCategory, sortBy])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchAvailableTasks()
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  useEffect(() => {
    if (currentAccount) {
      fetchUserApplications()
    }
  }, [currentAccount])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-3 bg-background/95 p-4 rounded-lg shadow-lg">
          <Loader2 className="h-5 w-5 animate-spin text-apple-blue" />
          <p className="font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const handleTaskApplicationSubmitted = () => {
    fetchAvailableTasks()
    fetchUserApplications()
    toast({
      title: "Application Submitted! 🎉",
      description: "Your application has been sent to the client.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Freelancer Dashboard</h1>
              <p className="text-muted-foreground">
                Discover opportunities and manage your applications
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Hello, {String(user.displayName || user.name || 'User')}!
                </p>
                {currentAccount && (
                  <p className="text-sm text-muted-foreground font-mono">
                    {currentAccount.substring(0, 6)}...{currentAccount.slice(-4)}
                  </p>
                )}
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src={(user.avatar as string) || '/placeholder-user.jpg'} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </motion.div>

        {/* Wallet Connection */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                    <div>
                      <h3 className="font-semibold text-orange-800">Connect Your Wallet</h3>
                      <p className="text-sm text-orange-700">
                        Connect MetaMask to apply for tasks and manage applications
                      </p>
                    </div>
                  </div>
                  <Button onClick={connect} className="bg-orange-600 hover:bg-orange-700">
                    Connect Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ 
              scale: 1.02,
              y: -4,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.p 
                      className="text-sm text-blue-700 font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Total Applications
                    </motion.p>
                    <motion.p 
                      className="text-3xl font-bold text-blue-800"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {stats.totalApplications}
                    </motion.p>
                  </div>
                  <motion.div 
                    className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 10,
                      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Send className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ 
              scale: 1.02,
              y: -4,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.p 
                      className="text-sm text-green-700 font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Active Applications
                    </motion.p>
                    <motion.p 
                      className="text-3xl font-bold text-green-800"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {stats.activeApplications}
                    </motion.p>
                  </div>
                  <motion.div 
                    className="p-3 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 10,
                      boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Target className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ 
              scale: 1.02,
              y: -4,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.p 
                      className="text-sm text-purple-700 font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Avg. AI Match
                    </motion.p>
                    <motion.div className="flex items-center gap-1">
                      <motion.p 
                        className="text-3xl font-bold text-purple-800"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 20 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {stats.averageMatchScore}
                      </motion.p>
                      <motion.span 
                        className="text-lg font-medium text-purple-600"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        %
                      </motion.span>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 10,
                      boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Star className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ 
              scale: 1.02,
              y: -4,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-emerald-50 to-emerald-100 overflow-hidden relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.p 
                      className="text-sm text-emerald-700 font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Total Earnings
                    </motion.p>
                    <motion.div className="flex items-center gap-1">
                      <motion.p 
                        className="text-3xl font-bold text-emerald-800"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 20 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {stats.totalEarnings}
                      </motion.p>
                      <motion.span 
                        className="text-lg font-medium text-emerald-600"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        XDC
                      </motion.span>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="p-3 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 10,
                      boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <DollarSign className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse Tasks
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                My Applications
              </TabsTrigger>
            </TabsList>

            {/* Browse Tasks Tab */}
            <TabsContent value="browse" className="space-y-6">
              {/* Search and Filters */}
              <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="highest-reward">Highest Reward</SelectItem>
                        <SelectItem value="lowest-reward">Lowest Reward</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tasks Grid */}
              {tasksLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-64 animate-pulse bg-muted">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="h-4 bg-muted-foreground/20 rounded"></div>
                          <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                          <div className="h-20 bg-muted-foreground/20 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : tasksError ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">⚠️ {tasksError}</div>
                  <Button onClick={fetchAvailableTasks} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : availableTasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No tasks found matching your criteria.</p>
                  <Button onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                    fetchAvailableTasks()
                  }} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableTasks.map((task, index) => (
                    <TaskCard 
                      key={task._id} 
                      task={task} 
                      index={index}
                      onApplicationSubmitted={handleTaskApplicationSubmitted}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* My Applications Tab */}
            <TabsContent value="applications" className="space-y-6">
              {applicationsLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-apple-blue" />
                  <p className="ml-2 text-muted-foreground">Loading your applications...</p>
                </div>
              ) : userApplications.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start applying to tasks to see your applications here
                  </p>
                  <Button onClick={() => {
                    const tabsList = document.querySelector('[value="browse"]') as HTMLElement
                    if (tabsList) tabsList.click()
                  }}>
                    Browse Tasks
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userApplications.map((application) => (
                    <Card key={application._id} className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{application.taskTitle}</h3>
                              <Badge variant="outline">{application.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {application.proposal}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-apple-green font-medium">
                                {application.bidAmount} {application.taskCurrency}
                              </span>
                              <span className="text-muted-foreground">
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </span>
                              {application.aiAnalysis && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                  AI Match: {application.aiAnalysis.matchScore}%
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={application.clientAvatar} />
                              <AvatarFallback className="text-xs">
                                {application.clientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{application.clientName}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
