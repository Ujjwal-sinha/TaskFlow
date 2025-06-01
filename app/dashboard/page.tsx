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

export default function DashboardPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const { isConnected, currentAccount, connect } = useTaskEscrow(
    process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS
  )

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
