"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/custom/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import XDCpayment from "@/components/custom/XDCpayment"
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
import { useUser } from "@civic/auth-web3/react"

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
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading or redirecting...</p>
      </div>
    );
  }

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
                <p className="text-sm text-muted-foreground">Hello, {String(user.displayName || user.name || 'User')}!</p>
                <p className="text-sm text-muted-foreground">{String(user.walletAddress || '')}</p>
              </div>
              <Avatar className="h-12 w-12">
               
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

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">My Tasks</TabsTrigger>
              <TabsTrigger value="payment">XDC Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              {/* Recent Activity */}
              <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-apple-green" />
                        <div>
                          <p className="font-medium">Completed task: Design Mobile App Interface</p>
                          <p className="text-sm text-muted-foreground">Received $800</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5 text-apple-blue" />
                        <div>
                          <p className="font-medium">Funds deposited for: Build React Dashboard</p>
                          <p className="text-sm text-muted-foreground">$1200 in escrow</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-apple-orange" />
                        <div>
                          <p className="font-medium">New message from: TechCorp Inc.</p>
                          <p className="text-sm text-muted-foreground">Regarding project updates</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">3 days ago</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tasks" className="mt-6">
              {/* My Tasks */}
              <div className="space-y-6">
                {tasks.map((task) => (
                  <Card key={task.id} className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{task.title}</h3>
                          <p className="text-muted-foreground text-sm">Client: {task.client}</p>
                        </div>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">Budget:</p>
                          <p className="font-medium">${task.budget}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deadline:</p>
                          <p className="font-medium">{task.deadline}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Escrow Status:</p>
                          <p className={`font-medium ${getEscrowColor(task.escrowStatus)}`}>{task.escrowStatus}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-muted-foreground mb-2">Progress:</p>
                        <Progress value={task.progress} className="w-full" />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" /> Submit Work
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="payment" className="mt-6">
              <div className="flex justify-center">
                <XDCpayment />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
