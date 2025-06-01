"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Star, Loader2, FileText, AlertCircle } from "lucide-react"
import { UserApplication } from "./types"

interface ApplicationsListProps {
  applications: UserApplication[]
  loading: boolean
}

export function ApplicationsList({ applications, loading }: ApplicationsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "completed":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
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
          <span>Loading applications...</span>
        </div>
      </motion.div>
    )
  }

  if (applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12"
      >
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't submitted any applications. Browse available tasks to get started!
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((application, index) => (
        <motion.div
          key={application._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="border-0 shadow-apple hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 line-clamp-1">
                    {application.taskTitle}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">
                        {application.taskReward} {application.taskCurrency}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Applied {formatDate(application.appliedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                  {application.aiAnalysis && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{application.aiAnalysis.matchScore}%</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={application.clientAvatar} alt={application.clientName} />
                  <AvatarFallback>
                    {application.clientName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{application.clientName}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Your Proposal:</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {application.proposal}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Your Bid: </span>
                    <span className="font-medium">${application.bidAmount}</span>
                  </div>
                  
                  {application.aiAnalysis && (
                    <div className="text-xs text-muted-foreground max-w-xs">
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span className="line-clamp-1">{application.aiAnalysis.reason}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 