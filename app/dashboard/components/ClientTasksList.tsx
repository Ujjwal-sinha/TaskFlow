"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Star, Target, Users } from "lucide-react"
import { ClientTask, ClientStats } from "./types"

interface ClientTasksListProps {
  tasks: ClientTask[]
  stats: ClientStats
  loading: boolean
}

export function ClientTasksList({ tasks, stats, loading }: ClientTasksListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-apple-blue" />
        <p className="ml-2 text-muted-foreground">Loading your tasks...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Tasks Created Yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first task to start receiving applications
        </p>
        <Button onClick={() => window.location.href = '/post-task'}>
          Post a Task
        </Button>
      </div>
    )
  }

  const statsConfig = [
    { label: "Total Tasks", value: stats.totalTasks, color: "blue" },
    { label: "Open", value: stats.openTasks, color: "green" },
    { label: "In Progress", value: stats.inProgressTasks, color: "yellow" },
    { label: "Completed", value: stats.completedTasks, color: "purple" },
    { label: "Total Applicants", value: stats.totalApplicants, color: "indigo" },
    { label: "XDC Posted", value: stats.totalRewardPosted, color: "emerald" }
  ]

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open': return 'default'
      case 'in-progress': return 'secondary'
      case 'completed': return 'outline'
      default: return 'destructive'
    }
  }

  const getStatsBgColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200",
      green: "bg-green-50 border-green-200",
      yellow: "bg-yellow-50 border-yellow-200",
      purple: "bg-purple-50 border-purple-200",
      indigo: "bg-indigo-50 border-indigo-200",
      emerald: "bg-emerald-50 border-emerald-200"
    }
    return colorMap[color] || "bg-gray-50 border-gray-200"
  }

  const getStatsTextColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "text-blue-700",
      green: "text-green-700",
      yellow: "text-yellow-700",
      purple: "text-purple-700",
      indigo: "text-indigo-700",
      emerald: "text-emerald-700"
    }
    return colorMap[color] || "text-gray-700"
  }

  const getStatsSubTextColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "text-blue-600",
      green: "text-green-600",
      yellow: "text-yellow-600",
      purple: "text-purple-600",
      indigo: "text-indigo-600",
      emerald: "text-emerald-600"
    }
    return colorMap[color] || "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Client Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsConfig.map((stat) => (
          <Card key={stat.label} className={getStatsBgColor(stat.color)}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${getStatsTextColor(stat.color)}`}>
                {stat.value}
              </div>
              <div className={`text-xs ${getStatsSubTextColor(stat.color)}`}>
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task._id} className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Task Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <Badge variant={getStatusVariant(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600 font-medium">
                        {task.reward} {task.currency}
                      </span>
                      <span className="text-muted-foreground">
                        Created {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-muted-foreground">
                        Due {new Date(task.deadline).toLocaleDateString()}
                      </span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {task.applicantCount} applicants
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Applicants */}
                {task.applicants.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Applicants ({task.applicants.length})
                    </h4>
                    <div className="space-y-3">
                      {task.applicants.slice(0, 3).map((applicant) => (
                        <div key={applicant._id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={applicant.userAvatar} />
                            <AvatarFallback className="text-xs">
                              {applicant.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium truncate">{applicant.userName}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground">
                                  {applicant.userRating === 0 ? 'New' : applicant.userRating.toFixed(1)}
                                </span>
                              </div>
                              <span className="text-xs text-green-600 font-medium">
                                {applicant.bidAmount} XDC
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                              {applicant.proposal}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {task.applicants.length > 3 && (
                        <div className="text-center">
                          <Button variant="outline" size="sm">
                            View all {task.applicants.length} applicants
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}