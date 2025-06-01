"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Users, Loader2, Briefcase, Eye, CheckCircle } from "lucide-react"
import { ClientTask } from "./types"

interface ClientTasksListProps {
  tasks: ClientTask[]
  loading: boolean
  onSelectApplicant?: (taskId: string, applicantId: string) => void
}

export function ClientTasksList({ tasks, loading, onSelectApplicant }: ClientTasksListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "completed":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-12"
      >
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your tasks...</span>
        </div>
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
            <h3 className="text-lg font-semibold mb-2">No Tasks Posted</h3>
            <p className="text-muted-foreground mb-4">
              You haven't posted any tasks yet. Create your first task to get started!
            </p>
            <Button>Post a Task</Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {tasks.map((task, index) => (
        <motion.div
          key={task._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="border-0 shadow-apple hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2 line-clamp-1">
                    {task.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">
                        {task.reward} {task.currency}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {formatDate(task.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{task.applicantCount} applicants</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Posted {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {task.applicants.length > 0 ? (
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Applicants ({task.applicants.length})
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {task.applicants.slice(0, 3).map((applicant) => (
                      <div
                        key={applicant._id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={applicant.userAvatar} alt={applicant.userName} />
                            <AvatarFallback>
                              {applicant.userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{applicant.userName}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  ⭐ {applicant.userRating}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Bid: ${applicant.bidAmount} • Applied {formatDate(applicant.appliedAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {task.status === 'open' && onSelectApplicant && (
                            <Button 
                              size="sm"
                              onClick={() => onSelectApplicant(task._id, applicant._id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Select
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {task.applicants.length > 3 && (
                      <div className="text-center">
                        <Button variant="ghost" size="sm">
                          View all {task.applicants.length} applicants
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No applicants yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 