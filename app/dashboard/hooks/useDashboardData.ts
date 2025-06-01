"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Task, UserApplication, ClientTask, UserStats, ClientStats } from "../components/types"

export const useDashboardData = () => {
  const { toast } = useToast()

  // State
  const [availableTasks, setAvailableTasks] = useState<Task[]>([])
  const [userApplications, setUserApplications] = useState<UserApplication[]>([])
  const [clientTasks, setClientTasks] = useState<ClientTask[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalApplications: 0,
    activeApplications: 0,
    averageMatchScore: 0,
    totalEarnings: 0
  })
  const [clientStats, setClientStats] = useState<ClientStats>({
    totalTasks: 0,
    openTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    totalApplicants: 0,
    totalRewardPosted: 0
  })

  // Loading states
  const [tasksLoading, setTasksLoading] = useState(false)
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [clientTasksLoading, setClientTasksLoading] = useState(false)

  // Error states
  const [tasksError, setTasksError] = useState<string | null>(null)

  // Fetch available tasks
  const fetchAvailableTasks = useCallback(async (
    searchQuery?: string,
    selectedCategory?: string,
    sortBy?: string
  ) => {
    try {
      setTasksLoading(true)
      setTasksError(null)

      const params = new URLSearchParams({
        sortBy: sortBy || 'newest',
        limit: '12'
      })

      if (selectedCategory && selectedCategory !== "All") {
        params.append('category', selectedCategory)
      }

      if (searchQuery?.trim()) {
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
  }, [])

  // Fetch user applications
  const fetchUserApplications = useCallback(async (userId?: string) => {
    if (!userId) return

    try {
      setApplicationsLoading(true)
      const response = await fetch(`/api/users/${userId}/applications`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      if (data.success) {
        setUserApplications(data.applications || [])
        
        // Calculate user stats
        const totalApplications = data.applications.length
        const activeApplications = data.applications.filter(
          (app: UserApplication) => app.status === 'pending'
        ).length
        const averageMatchScore = data.applications.reduce(
          (sum: number, app: UserApplication) => sum + (app.aiAnalysis?.matchScore || 0), 0
        ) / Math.max(totalApplications, 1)
        
        setUserStats({
          totalApplications,
          activeApplications,
          averageMatchScore: Math.round(averageMatchScore),
          totalEarnings: 0 // This would come from completed tasks
        })
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
      toast({
        title: "Error",
        description: "Failed to load your applications",
        variant: "destructive"
      })
    } finally {
      setApplicationsLoading(false)
    }
  }, [toast])

  // Fetch client tasks
  const fetchClientTasks = useCallback(async (userId?: string) => {
    if (!userId) return

    try {
      setClientTasksLoading(true)
      const response = await fetch(`/api/users/${userId}/tasks`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch client tasks')
      }

      const data = await response.json()
      if (data.success) {
        setClientTasks(data.tasks || [])
        
        // Calculate client stats
        const totalTasks = data.tasks.length
        const openTasks = data.tasks.filter(
          (task: ClientTask) => task.status === 'open'
        ).length
        const inProgressTasks = data.tasks.filter(
          (task: ClientTask) => task.status === 'in_progress'
        ).length
        const completedTasks = data.tasks.filter(
          (task: ClientTask) => task.status === 'completed'
        ).length
        const totalApplicants = data.tasks.reduce(
          (sum: number, task: ClientTask) => sum + task.applicantCount, 0
        )
        const totalRewardPosted = data.tasks.reduce(
          (sum: number, task: ClientTask) => sum + task.reward, 0
        )

        setClientStats({
          totalTasks,
          openTasks,
          inProgressTasks,
          completedTasks,
          totalApplicants,
          totalRewardPosted
        })
      }
    } catch (err) {
      console.error('Error fetching client tasks:', err)
      toast({
        title: "Error",
        description: "Failed to load your tasks",
        variant: "destructive"
      })
    } finally {
      setClientTasksLoading(false)
    }
  }, [toast])

  // Refetch all data
  const refetchData = useCallback((userId?: string) => {
    fetchUserApplications(userId)
    fetchClientTasks(userId)
    fetchAvailableTasks()
  }, [fetchUserApplications, fetchClientTasks, fetchAvailableTasks])

  return {
    // Data
    availableTasks,
    userApplications,
    clientTasks,
    userStats,
    clientStats,

    // Loading states
    tasksLoading,
    applicationsLoading,
    clientTasksLoading,

    // Error states
    tasksError,

    // Functions
    fetchAvailableTasks,
    fetchUserApplications,
    fetchClientTasks,
    refetchData
  }
} 