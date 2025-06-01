"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { TaskCard } from "@/components/custom/task-card"
import { Task } from "./types"
import { useTaskEscrow } from "@/hooks/useTaskEscrow"

interface TasksGridProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  onRetry: () => void
  onClearFilters: () => void
  onApplicationSubmitted: () => void
}

export function TasksGrid({
  tasks,
  loading,
  error,
  onRetry,
  onClearFilters,
  onApplicationSubmitted
}: TasksGridProps) {
  const { currentAccount } = useTaskEscrow(process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS)

  // Helper function to check if current user is the task creator
  const isTaskCreator = (task: Task) => {
    if (!currentAccount) return false
    
    const walletAddress = currentAccount.toLowerCase()
    const taskCreatorId = task.client?.id?.toLowerCase()
    // console.log(task.client?.address)
    
    return walletAddress === taskCreatorId
  }

  if (loading) {
    return (
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
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No tasks found matching your criteria.</p>
        <Button onClick={onClearFilters} variant="outline">
          Clear Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task, index) => (
        <TaskCard 
          key={task._id} 
          task={task} 
          index={index}
          onApplicationSubmitted={onApplicationSubmitted}
          isTaskCreator={isTaskCreator(task)}
        />
      ))}
    </div>
  )
}