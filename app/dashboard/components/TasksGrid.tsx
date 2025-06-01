"use client"

import { motion } from "framer-motion"
import { TaskCard } from "@/components/custom/task-card"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Briefcase, AlertCircle } from "lucide-react"
import { Task } from "./types"

interface TasksGridProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  onApplicationSubmitted: () => void
}

export function TasksGrid({ tasks, loading, error, onApplicationSubmitted }: TasksGridProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-12"
      >
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading tasks...</span>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12"
      >
        <Card className="border-dashed border-2 border-red-200 bg-red-50/50">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Error Loading Tasks
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12"
      >
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tasks Found</h3>
            <p className="text-muted-foreground mb-4">
              No tasks match your current filters. Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {tasks.map((task, index) => (
        <TaskCard
          key={task._id}
          task={task}
          index={index}
          onApplicationSubmitted={onApplicationSubmitted}
        />
      ))}
    </motion.div>
  )
} 