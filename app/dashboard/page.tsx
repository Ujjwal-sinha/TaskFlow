"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/custom/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@civic/auth-web3/react"
import { useTaskEscrow } from "@/hooks/useTaskEscrow"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Import modular components
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

  // Dashboard data hook
  const {
    availableTasks,
    userApplications,
    clientTasks,
    userStats,
    clientStats,
    tasksLoading,
    applicationsLoading,
    clientTasksLoading,
    tasksError,
    fetchAvailableTasks,
    fetchUserApplications,
    fetchClientTasks,
    refetchData
  } = useDashboardData()

  // Local state
  const [activeTab, setActiveTab] = useState("freelancer")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

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

  // Fetch data on mount and when filters change
  useEffect(() => {
    if (user) {
      fetchAvailableTasks(searchQuery, selectedCategory, sortBy)
      fetchUserApplications(user.id)
      fetchClientTasks(user.id)
    }
  }, [user, searchQuery, selectedCategory, sortBy, fetchAvailableTasks, fetchUserApplications, fetchClientTasks])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user) {
        fetchAvailableTasks(searchQuery, selectedCategory, sortBy)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, user, selectedCategory, sortBy, fetchAvailableTasks])

  // Handle application submission
  const handleTaskApplicationSubmitted = () => {
    if (user) {
      fetchUserApplications(user.id)
      fetchAvailableTasks(searchQuery, selectedCategory, sortBy)
    }
  }

  // Handle applicant selection
  const handleSelectApplicant = async (taskId: string, applicantId: string) => {
    try {
      // This would integrate with your smart contract
      toast({
        title: "Feature Coming Soon",
        description: "Applicant selection will be integrated with smart contracts",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select applicant",
        variant: "destructive"
      })
    }
  }

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Dashboard Header */}
        <DashboardHeader
          user={user}
          isConnected={isConnected}
          currentAccount={currentAccount}
          onConnect={connect}
        />

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="freelancer">Freelancer View</TabsTrigger>
            <TabsTrigger value="client">Client View</TabsTrigger>
          </TabsList>

          {/* Stats Grid */}
          <StatsGrid
            userStats={userStats}
            clientStats={clientStats}
            activeTab={activeTab}
          />

          {/* Freelancer Tab */}
          <TabsContent value="freelancer" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Tabs defaultValue="browse" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="browse">Browse Tasks</TabsTrigger>
                  <TabsTrigger value="applications">My Applications</TabsTrigger>
                </TabsList>

                <TabsContent value="browse" className="space-y-6">
                  <TasksFilters
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    sortBy={sortBy}
                    onSearchChange={setSearchQuery}
                    onCategoryChange={setSelectedCategory}
                    onSortChange={setSortBy}
                  />
                  
                  <TasksGrid
                    tasks={availableTasks}
                    loading={tasksLoading}
                    error={tasksError}
                    onApplicationSubmitted={handleTaskApplicationSubmitted}
                  />
                </TabsContent>

                <TabsContent value="applications">
                  <ApplicationsList
                    applications={userApplications}
                    loading={applicationsLoading}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          </TabsContent>

          {/* Client Tab */}
          <TabsContent value="client" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ClientTasksList
                tasks={clientTasks}
                loading={clientTasksLoading}
                onSelectApplicant={handleSelectApplicant}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
