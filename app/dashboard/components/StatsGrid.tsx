"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Briefcase, 
  Target, 
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  Star
} from "lucide-react"
import { UserStats, ClientStats } from "./types"

interface StatsGridProps {
  userStats: UserStats
  clientStats: ClientStats
  activeTab: string
}

export function StatsGrid({ userStats, clientStats, activeTab }: StatsGridProps) {
  const freelancerStats = [
    {
      title: "Total Applications",
      value: userStats.totalApplications,
      icon: User,
      color: "from-blue-500 to-blue-600",
      description: "Applications submitted"
    },
    {
      title: "Active Applications",
      value: userStats.activeApplications,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      description: "Currently pending"
    },
    {
      title: "Average Match Score",
      value: `${userStats.averageMatchScore}%`,
      icon: Target,
      color: "from-green-500 to-green-600",
      description: "AI compatibility rating"
    },
    {
      title: "Total Earnings",
      value: `$${userStats.totalEarnings}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      description: "From completed tasks"
    }
  ]

  const clientStatsData = [
    {
      title: "Total Tasks Posted",
      value: clientStats.totalTasks,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      description: "Tasks created"
    },
    {
      title: "Open Tasks",
      value: clientStats.openTasks,
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      description: "Accepting applications"
    },
    {
      title: "Completed Tasks",
      value: clientStats.completedTasks,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      description: "Successfully finished"
    },
    {
      title: "Total Applicants",
      value: clientStats.totalApplicants,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      description: "Across all tasks"
    }
  ]

  const stats = activeTab === "freelancer" ? freelancerStats : clientStatsData

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="border-0 shadow-apple hover:shadow-lg transition-all duration-300 overflow-hidden relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </motion.div>
            </CardHeader>
            <CardContent className="relative">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
                className="text-2xl font-bold mb-1"
              >
                {stat.value}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              
              {/* Add trending indicator for some stats */}
              {(stat.title.includes("Applications") || stat.title.includes("Tasks")) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="mt-2"
                >
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 