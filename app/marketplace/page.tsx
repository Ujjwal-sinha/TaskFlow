"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/custom/navigation"
import { TaskCard } from "@/components/custom/task-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal, Loader2, AlertCircle, Briefcase } from "lucide-react"
import { useUser } from "@civic/auth-web3/react"
import { useToast } from "@/hooks/use-toast"

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

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <Card className="h-80 overflow-hidden border-0 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      {/* Header skeleton */}
                      <div className="flex justify-between items-start">
                        <motion.div 
                          className="h-6 w-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full"
                          animate={{ 
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          style={{
                            backgroundSize: "200% 200%"
                          }}
                        />
                        <motion.div 
                          className="h-8 w-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg"
                          animate={{ 
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 0.3
                          }}
                          style={{
                            backgroundSize: "200% 200%"
                          }}
                        />
                      </div>
                      
                      {/* Title skeleton */}
                      <div className="space-y-2">
                        <motion.div 
                          className="h-5 w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded"
                          animate={{ 
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 0.1
                          }}
                          style={{
                            backgroundSize: "200% 200%"
                          }}
                        />
                        <motion.div 
                          className="h-5 w-3/4 bg-gradient-to-r from-gray-200 to-gray-100 rounded"
                          animate={{ 
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 0.2
                          }}
                          style={{
                            backgroundSize: "200% 200%"
                          }}
                        />
                      </div>
                      
                      {/* Description skeleton */}
                      <div className="space-y-2">
                        {[...Array(3)].map((_, lineIndex) => (
                          <motion.div 
                            key={lineIndex}
                            className={`h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded ${
                              lineIndex === 2 ? 'w-2/3' : 'w-full'
                            }`}
                            animate={{ 
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                              delay: 0.4 + (lineIndex * 0.1)
                            }}
                            style={{
                              backgroundSize: "200% 200%"
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Tags skeleton */}
                      <div className="flex gap-2">
                        {[...Array(3)].map((_, tagIndex) => (
                          <motion.div 
                            key={tagIndex}
                            className="h-6 w-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full"
                            animate={{ 
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                              delay: 0.6 + (tagIndex * 0.1)
                            }}
                            style={{
                              backgroundSize: "200% 200%"
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Details skeleton */}
                      <div className="space-y-3 pt-2">
                        {[...Array(3)].map((_, detailIndex) => (
                          <motion.div 
                            key={detailIndex}
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: 0.8 + (detailIndex * 0.1),
                              duration: 0.3
                            }}
                          >
                            <div className="h-4 w-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full" />
                            <motion.div 
                              className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded"
                              animate={{ 
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 1 + (detailIndex * 0.1)
                              }}
                              style={{
                                backgroundSize: "200% 200%"
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Footer skeleton */}
                      <div className="flex justify-between items-center pt-4">
                        <div className="flex items-center space-x-2">
                          <motion.div 
                            className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full"
                            animate={{ 
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                              delay: 1.2
                            }}
                            style={{
                              backgroundSize: "200% 200%"
                            }}
                          />
                          <div className="space-y-1">
                            <motion.div 
                              className="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-100 rounded"
                              animate={{ 
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 1.3
                              }}
                              style={{
                                backgroundSize: "200% 200%"
                              }}
                            />
                            <motion.div 
                              className="h-3 w-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded"
                              animate={{ 
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 1.4
                              }}
                              style={{
                                backgroundSize: "200% 200%"
                              }}
                            />
                          </div>
                        </div>
                        <motion.div 
                          className="h-8 w-16 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg"
                          animate={{ 
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 1.5
                          }}
                          style={{
                            backgroundSize: "200% 200%"
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: 0.2
                }}
              >
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold text-red-600 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                ⚠️ {error}
              </motion.h3>
              <motion.p 
                className="text-muted-foreground mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Something went wrong while loading tasks. Please try again.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={() => fetchTasks(1)} variant="outline" size="lg" className="rounded-xl">
                  Try Again
                </Button>
              </motion.div>
            </motion.div>
          ) : tasks.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: 0.2
                }}
              >
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mb-8">
                  <Briefcase className="h-16 w-16 text-blue-400" />
                </div>
              </motion.div>
              <motion.h3 
                className="text-2xl font-semibold mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                No tasks found
              </motion.h3>
              <motion.p 
                className="text-muted-foreground mb-8 max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                We couldn't find any tasks matching your criteria. Try adjusting your search or filters.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  fetchTasks(1)
                }} variant="outline" size="lg" className="rounded-xl">
                  Clear Filters
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    index={index} 
                    onApplicationSubmitted={() => {
                      // Refresh tasks to update applicant count
                      fetchTasks(pagination.page)
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Load More Button */}
          {!loading && !error && pagination.page < pagination.pages && (
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  className="rounded-xl px-8 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 hover:border-blue-300 text-blue-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.span
                    className="flex items-center gap-2"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    Load More Tasks 
                    <span className="text-sm opacity-75">
                      ({pagination.page}/{pagination.pages})
                    </span>
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Total Count */}
          {!loading && !error && (
            <motion.div 
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.p 
                className="text-sm text-muted-foreground"
                whileHover={{ scale: 1.02 }}
              >
                Showing <span className="font-medium text-blue-600">{tasks.length}</span> of{" "}
                <span className="font-medium text-blue-600">{pagination.total}</span> tasks
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
