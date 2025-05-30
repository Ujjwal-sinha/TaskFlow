"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/custom/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  Eye,
  Download,
} from "lucide-react"

// Mock data
const stats = [
  {
    title: "Total Earnings",
    value: "$12,450",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-apple-green",
  },
  {
    title: "Active Tasks",
    value: "8",
    change: "+2",
    icon: Clock,
    color: "text-apple-blue",
  },
  {
    title: "Completed Tasks",
    value: "47",
    change: "+5",
    icon: CheckCircle,
    color: "text-apple-purple",
  },
  {
    title: "Rating",
    value: "4.9",
    change: "+0.1",
    icon: Star,
    color: "text-apple-yellow",
  },
]

const tasks = [
  {
    id: "1",
    title: "Design Mobile App Interface",
    client: "TechCorp Inc.",
    status: "In Progress",
    progress: 75,
    deadline: "2024-01-15",
    budget: 800,
    escrowStatus: "Funded",
  },
  {
    id: "2",
    title: "Build React Dashboard",
    client: "StartupXYZ",
    status: "Pending Review",
    progress: 100,
    deadline: "2024-01-10",
    budget: 1200,
    escrowStatus: "Pending Release",
  },
  {
    id: "3",
    title: "Content Writing for Blog",
    client: "ContentCorp",
    status: "In Progress",
    progress: 40,
    deadline: "2024-01-20",
    budget: 300,
    escrowStatus: "Funded",
  },
  {
    id: "4",
    title: "Logo Design Project",
    client: "BrandCo",
    status: "Completed",
    progress: 100,
    deadline: "2024-01-05",
    budget: 500,
    escrowStatus: "Released",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "bg-apple-blue text-white"
    case "Pending Review":
      return "bg-apple-orange text-white"
    case "Completed":
      return "bg-apple-green text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getEscrowColor = (status: string) => {
  switch (status) {
    case "Funded":
      return "text-apple-green"
    case "Pending Release":
      return "text-apple-orange"
    case "Released":
      return "text-apple-blue"
    default:
      return "text-muted-foreground"
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's an overview of your freelance activity.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Reputation Score</p>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-apple-yellow text-apple-yellow" />
                    ))}
                  </div>
                  <span className="font-semibold">4.9</span>
                </div>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={stat.title} className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-apple-green">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-background ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:w-96">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tasks */}
                <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Recent Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.client}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                              <span className="text-xs text-muted-foreground">Due {task.deadline}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-apple-green">${task.budget}</p>
                            <Progress value={task.progress} className="w-20 mt-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Earnings Chart */}
                <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Earnings Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">This Month</span>
                        <span className="font-semibold text-apple-green">$3,200</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Last Month</span>
                        <span className="font-semibold">$2,800</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Pending</span>
                        <span className="font-semibold text-apple-orange">$1,500</span>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Earned</span>
                          <span className="text-xl font-bold text-apple-green">$12,450</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>All Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-6 bg-background rounded-lg border">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                            <p className="text-muted-foreground mb-2">Client: {task.client}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4" />
                                Due {task.deadline}
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="mr-1 h-4 w-4" />${task.budget}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                            <p className={`text-sm mt-2 ${getEscrowColor(task.escrowStatus)}`}>
                              Escrow: {task.escrowStatus}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} />
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message Client
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          {task.status === "Completed" && (
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download Invoice
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Earnings History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks
                        .filter((task) => task.status === "Completed")
                        .map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">{task.client}</p>
                              <p className="text-xs text-muted-foreground">Completed {task.deadline}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-apple-green">+${task.budget}</p>
                              <p className="text-xs text-muted-foreground">XDC Network</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-apple-green/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Available</span>
                          <CheckCircle className="h-4 w-4 text-apple-green" />
                        </div>
                        <p className="text-2xl font-bold text-apple-green">$8,950</p>
                      </div>

                      <div className="p-4 bg-apple-orange/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">In Escrow</span>
                          <AlertCircle className="h-4 w-4 text-apple-orange" />
                        </div>
                        <p className="text-2xl font-bold text-apple-orange">$2,000</p>
                      </div>

                      <div className="p-4 bg-apple-blue/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Pending</span>
                          <Clock className="h-4 w-4 text-apple-blue" />
                        </div>
                        <p className="text-2xl font-bold text-apple-blue">$1,500</p>
                      </div>

                      <Button className="w-full bg-apple-green hover:bg-apple-green/90">Withdraw Funds</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
