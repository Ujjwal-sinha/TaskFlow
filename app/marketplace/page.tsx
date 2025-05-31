"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/custom/navigation"
import { TaskCard } from "@/components/custom/task-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { useUser } from "@civic/auth-web3/react"
import { useToast } from "@/hooks/use-toast"
import XDCpayment from "@/components/custom/XDCpayment"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"

const categories = ["All", "Design", "Development", "Writing", "Blockchain", "Video", "Marketing", "Audio", "Business", "Data", "Translation"]

interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  reward: number;
  currency: string;
  deadline: string;
  location: string;
  client: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  applicants: number;
  tags: string[];
  status: string;
  createdAt: string;
}

export default function MarketplacePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Fetch tasks from API
  const fetchTasks = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy
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
      
      // Transform deadline to relative format
      const transformedTasks = data.tasks.map((task: any) => ({
        ...task,
        deadline: formatDeadline(task.deadline)
      }))

      setTasks(transformedTasks)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to load tasks. Please try again.')
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Format deadline to relative time
  const formatDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return 'Expired'
    } else if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Tomorrow'
    } else if (diffDays < 7) {
      return `in ${diffDays} days`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `in ${weeks} week${weeks > 1 ? 's' : ''}`
    } else {
      const months = Math.floor(diffDays / 30)
      return `in ${months} month${months > 1 ? 's' : ''}`
    }
  }

  // Fetch tasks on component mount and when filters change
  useEffect(() => {
    fetchTasks(1)
  }, [selectedCategory, sortBy])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchTasks(1)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchTasks(pagination.page + 1)
    }
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Task Marketplace</h1>
          <p className="text-muted-foreground">Discover opportunities and connect with clients worldwide</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks, skills, or keywords..."
                    className="pl-10 pr-4 py-2 rounded-lg bg-background border-0 shadow-sm focus-visible:ring-1 focus-visible:ring-apple-blue"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-[180px] bg-background border-0 shadow-sm focus:ring-1 focus:ring-apple-blue">
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

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-[180px] bg-background border-0 shadow-sm focus:ring-1 focus:ring-apple-blue">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="reward-high-to-low">Reward: High to Low</SelectItem>
                    <SelectItem value="reward-low-to-high">Reward: Low to High</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full lg:w-auto bg-background border-0 shadow-sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> More Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Task List or Payment Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-auto">
              <TabsTrigger value="tasks">Browse Tasks</TabsTrigger>
              <TabsTrigger value="payment">Make Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="mt-6">
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              {loading && tasks.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-apple-blue" />
                  <p className="ml-2 text-muted-foreground">Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <p className="text-center text-muted-foreground">No tasks found matching your criteria.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} index={0} />
                  ))}
                </div>
              )}
              {pagination.page < pagination.pages && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-apple-blue hover:bg-apple-blue/90 text-white"
                  >
                    {loading ? 'Loading More...' : 'Load More'}
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="payment" className="mt-6">
              <div className="flex justify-center">
                <XDCpayment />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
