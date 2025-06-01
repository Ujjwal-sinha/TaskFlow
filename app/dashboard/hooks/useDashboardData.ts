"use client"

import { useState, useEffect } from "react"
import { useTaskEscrow } from "@/hooks/useTaskEscrow"
import { Task, UserApplication, ClientTask, UserStats, ClientStats } from "../components/types"

interface UseDashboardDataReturn {
  // Available Tasks
  availableTasks: Task[]
  tasksLoading: boolean
  tasksError: string | null
  
  // User Applications
  userApplications: UserApplication[]
  applicationsLoading: boolean
  
  // Client Tasks
  clientTasks: ClientTask[]
  clientTasksLoading: boolean
  
  // Stats
  stats: UserStats
  clientStats: ClientStats
  
  // Actions
  fetchAvailableTasks: () => Promise<void>
  fetchUserApplications: () => Promise<void>
  fetchClientTasks: () => Promise<void>
  refreshAllData: () => Promise<void>
}

export function useDashboardData(
  searchQuery: string,
  selectedCategory: string,
  sortBy: string
): UseDashboardDataReturn {
  const { currentAccount } = useTaskEscrow(process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS)
  
  // Available Tasks State
  const [availableTasks, setAvailableTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [tasksError, setTasksError] = useState<string | null>(null)

  // User Applications State
  const [userApplications, setUserApplications] = useState<UserApplication[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)

  // Client Tasks State
  const [clientTasks, setClientTasks] = useState<ClientTask[]>([])
  const [clientTasksLoading, setClientTasksLoading] = useState(false)

  // Stats State
  const [stats, setStats] = useState<UserStats>({
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
    try {
      setApplicationsLoading(true)
      
      if (!currentAccount) {
        console.log('No wallet connected for fetching applications')
        setUserApplications([])
        return
      }
      
      const response = await fetch(`/api/users/${currentAccount}/applications`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      setUserApplications(data.applications || [])
      
      // Calculate stats from applications
      const applications = data.applications || []
      const activeApps = applications.filter((app: UserApplication) => 
        app.status === 'pending' || app.status === 'under-review'
      )
      const totalMatches = applications
        .filter((app: UserApplication) => app.aiAnalysis?.matchScore)
        .reduce((sum: number, app: UserApplication) => sum + (app.aiAnalysis?.matchScore || 0), 0)
      const avgMatch = applications.length > 0 ? Math.round(totalMatches / applications.length) : 0

      setStats(prev => ({
        ...prev,
        totalApplications: applications.length,
        activeApplications: activeApps.length,
        averageMatchScore: avgMatch
      }))
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setApplicationsLoading(false)
    }
  }

  // Fetch client tasks
  const fetchClientTasks = async () => {
    try {
      setClientTasksLoading(true)
      
      if (!currentAccount) {
        console.log('No wallet connected for fetching tasks')
        setClientTasks([])
        return
      }
      
      const response = await fetch(`/api/users/${currentAccount}/tasks`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch client tasks')
      }

      const data = await response.json()
      setClientTasks(data.tasks || [])
      
      // Calculate client stats
      const tasks = data.tasks || []
      const openTasks = tasks.filter((task: ClientTask) => task.status === 'open')
      const inProgressTasks = tasks.filter((task: ClientTask) => task.status === 'in-progress')
      const completedTasks = tasks.filter((task: ClientTask) => task.status === 'completed')
      const totalApplicants = tasks.reduce((sum: number, task: ClientTask) => sum + task.applicantCount, 0)
      const totalReward = tasks.reduce((sum: number, task: ClientTask) => sum + task.reward, 0)

      setClientStats({
        totalTasks: tasks.length,
        openTasks: openTasks.length,
        inProgressTasks: inProgressTasks.length,
        completedTasks: completedTasks.length,
        totalApplicants,
        totalRewardPosted: totalReward
      })
    } catch (err) {
      console.error('Error fetching client tasks:', err)
    } finally {
      setClientTasksLoading(false)
    }
  }

  // Refresh all data
  const refreshAllData = async () => {
    await Promise.all([
      fetchAvailableTasks(),
      fetchUserApplications(),
      fetchClientTasks()
    ])
  }

  // Effect to fetch tasks when filters change
  useEffect(() => {
    fetchAvailableTasks()
  }, [searchQuery, selectedCategory, sortBy])

  // Initial data fetch
  useEffect(() => {
    refreshAllData()
  }, [currentAccount]) // Refetch when wallet changes

  return {
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
    fetchUserApplications,
    fetchClientTasks,
    refreshAllData
  }
}