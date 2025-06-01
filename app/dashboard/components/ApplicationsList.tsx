"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Loader2 } from "lucide-react"
import { UserApplication } from "./types"

interface ApplicationsListProps {
  applications: UserApplication[]
  loading: boolean
  onBrowseTasks: () => void
}

export function ApplicationsList({ applications, loading, onBrowseTasks }: ApplicationsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-apple-blue" />
        <p className="ml-2 text-muted-foreground">Loading your applications...</p>
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
        <p className="text-muted-foreground mb-4">
          Start applying to tasks to see your applications here
        </p>
        <Button onClick={onBrowseTasks}>
          Browse Tasks
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application._id} className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{application.taskTitle}</h3>
                  <Badge variant="outline">{application.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {application.proposal}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-apple-green font-medium">
                    {application.bidAmount} {application.taskCurrency}
                  </span>
                  <span className="text-muted-foreground">
                    Applied {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                  {application.aiAnalysis && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      AI Match: {application.aiAnalysis.matchScore}%
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={application.clientAvatar} />
                  <AvatarFallback className="text-xs">
                    {application.clientName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{application.clientName}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}