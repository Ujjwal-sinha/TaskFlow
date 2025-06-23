"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/custom/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { useUser } from "@civic/auth-web3/react"
import { useTaskEscrow } from "@/hooks/useTaskEscrow"
import { useToast } from "@/hooks/use-toast"

// Import our new components
import { DashboardHeader } from "./components/DashboardHeader"
import { StatsGrid } from "./components/StatsGrid"
import { TasksFilters } from "./components/TasksFilters"
import { TasksGrid } from "./components/TasksGrid"
import { ApplicationsList } from "./components/ApplicationsList"
import { ClientTasksList } from "./components/ClientTasksList"
import { useDashboardData } from "./hooks/useDashboardData"
import { useLlamaFreelancerRecommendation } from "./hooks/useLlamaFreelancerRecommendation"

export default function DashboardPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected, currentAccount, connect } = useTaskEscrow(
    process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS
  )
  const llamaRecommendation = useLlamaFreelancerRecommendation()

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  // Use our custom hook for data management
  const {
    availableTasks,
    tasksLoading,
    tasksError,
    userApplications,
    applicationsLoading,
    clientTasks,
    clientTasksLoading,
    stats,
    clientStats,
    fetchAvailableTasks,
    refreshAllData
  } = useDashboardData(searchQuery, selectedCategory, sortBy)

  // Authentication check
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

  // Handle application submitted
  const handleTaskApplicationSubmitted = () => {
    refreshAllData()
    toast({
      title: "Application Submitted! 🎉",
      description: "Your application has been sent to the client.",
    })
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    fetchAvailableTasks()
  }

  // Handle browse tasks navigation
  const handleBrowseTasks = () => {
    const tabsList = document.querySelector('[value="browse"]') as HTMLElement
    if (tabsList) tabsList.click()
  }

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-background/95 p-4 rounded-lg shadow-lg">
          <Loader2 className="h-5 w-5 animate-spin text-apple-blue" />
          <p className="font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header Component */}
        <DashboardHeader
          user={user}
          currentAccount={currentAccount}
          isConnected={isConnected}
          onConnect={connect}
        />

        {/* Stats Grid Component */}
        <StatsGrid stats={stats} />

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">Browse Tasks</TabsTrigger>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
              <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
            </TabsList>

            {/* Browse Tasks Tab */}
            <TabsContent value="browse" className="space-y-6">
              <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <TasksFilters
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    sortBy={sortBy}
                    onSearchChange={setSearchQuery}
                    onCategoryChange={setSelectedCategory}
                    onSortChange={setSortBy}
                  />
                </CardContent>
              </Card>

              {/* --- Llama-3 Freelancer Recommendations Section --- */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold">AI Freelancer Recommendations</h3>
                  <button
                    className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow hover:from-blue-600 hover:to-purple-600 transition"
                    onClick={async () => {
                      if (availableTasks.length > 0) {
                        const task = {
                          title: availableTasks[0].title,
                          description: availableTasks[0].description,
                          category: availableTasks[0].category,
                          skills: availableTasks[0].skills || [],
                        }
                        const freelancers = [
                          { userId: '1', name: 'Alice', skills: ['React', 'Next.js'], rating: 4.8, completedJobs: 22, isActive: true },
                          { userId: '2', name: 'Bob', skills: ['Solidity', 'Web3'], rating: 4.6, completedJobs: 15, isActive: true },
                          { userId: '3', name: 'Charlie', skills: ['UI/UX', 'Figma'], rating: 4.9, completedJobs: 30, isActive: false },
                          { userId: '4', name: 'Diana', skills: ['Node.js', 'MongoDB'], rating: 4.7, completedJobs: 18, isActive: true },
                          { userId: '5', name: 'Eve', skills: ['Python', 'AI'], rating: 4.5, completedJobs: 12, isActive: true },
                        ]
                        try {
                          await llamaRecommendation.getRecommendations(task, freelancers)
                        } catch (err) {
                          // No-op, error will be handled in hook
                        }
                      }
                    }}
                    disabled={llamaRecommendation.loading}
                  >
                    {llamaRecommendation.loading ? 'Loading...' : 'Show Recommendations'}
                  </button>
                </div>
                {llamaRecommendation.error && (
                  <div className="text-red-500 mb-2">
                    {llamaRecommendation.error}
                    <div className="text-xs text-muted-foreground mt-1">
                      {process.env.NEXT_PUBLIC_GROQ_API_KEY ? (
                        <>Please check your API key, backend logs, or try again later.</>
                      ) : (
                        <>Groq API key is missing. Set <code>NEXT_PUBLIC_GROQ_API_KEY</code> in your environment.</>
                      )}
                    </div>
                  </div>
                )}
                {llamaRecommendation.recommendations.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {llamaRecommendation.recommendations.map((rec, i) => (
                      <Card key={rec.userId} className="border-blue-200 bg-blue-50/60">
                        <CardContent className="p-4">
                          <div className="font-semibold text-blue-900">{rec.userName}</div>
                          <div className="text-sm text-blue-700 mb-1">Score: <span className="font-bold">{rec.matchScore}</span></div>
                          <div className="text-xs text-blue-800">{rec.reason}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {!llamaRecommendation.loading && !llamaRecommendation.error && llamaRecommendation.recommendations.length === 0 && (
                  <div className="text-xs text-muted-foreground">No recommendations yet. Click the button above to get AI suggestions for the top freelancers.</div>
                )}
              </div>
              {/* --- End Recommendations Section --- */}

              <TasksGrid
                tasks={availableTasks}
                loading={tasksLoading}
                error={tasksError}
                onRetry={fetchAvailableTasks}
                onClearFilters={handleClearFilters}
                onApplicationSubmitted={handleTaskApplicationSubmitted}
              />
            </TabsContent>

            {/* My Applications Tab */}
            <TabsContent value="applications" className="space-y-6">
              <ApplicationsList
                applications={userApplications}
                loading={applicationsLoading}
                onBrowseTasks={handleBrowseTasks}
              />
            </TabsContent>

            {/* My Tasks Tab */}
            <TabsContent value="my-tasks" className="space-y-6">
              <ClientTasksList
                tasks={clientTasks}
                stats={clientStats}
                loading={clientTasksLoading}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
