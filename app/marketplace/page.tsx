"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/custom/navigation"
import { TaskCard } from "@/components/custom/task-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal } from "lucide-react"

// Mock data
const mockTasks = [
  {
    id: "1",
    title: "Design a Modern Landing Page for SaaS Product",
    description:
      "Looking for a talented UI/UX designer to create a modern, conversion-focused landing page for our new SaaS product. Must be responsive and follow current design trends.",
    category: "Design",
    reward: 500,
    currency: "XDC",
    deadline: "in 5 days",
    location: "Remote",
    client: {
      name: "TechCorp Inc.",
      avatar: "/placeholder-user.jpg",
      rating: 4.8,
    },
    applicants: 12,
    tags: ["UI/UX", "Figma", "Web Design", "Landing Page"],
  },
  {
    id: "2",
    title: "Full-Stack Web Application Development",
    description:
      "Need an experienced developer to build a full-stack web application with React, Node.js, and PostgreSQL. Project includes user authentication, dashboard, and API integration.",
    category: "Development",
    reward: 1200,
    currency: "XDC",
    deadline: "in 2 weeks",
    location: "Remote",
    client: {
      name: "StartupXYZ",
      avatar: "/placeholder-user.jpg",
      rating: 4.9,
    },
    applicants: 8,
    tags: ["React", "Node.js", "PostgreSQL", "Full-Stack"],
  },
  {
    id: "3",
    title: "Content Writing for Tech Blog",
    description:
      "Seeking a skilled content writer to create engaging blog posts about emerging technologies, AI, and blockchain. Must have technical writing experience.",
    category: "Writing",
    reward: 200,
    currency: "XDC",
    deadline: "in 1 week",
    location: "Remote",
    client: {
      name: "TechBlog Pro",
      avatar: "/placeholder-user.jpg",
      rating: 4.7,
    },
    applicants: 15,
    tags: ["Content Writing", "Tech", "Blog", "SEO"],
  },
  {
    id: "4",
    title: "Mobile App UI/UX Design",
    description:
      "Design a complete mobile app interface for iOS and Android. The app is a fitness tracker with social features. Need wireframes, mockups, and prototypes.",
    category: "Design",
    reward: 800,
    currency: "XDC",
    deadline: "in 10 days",
    location: "Remote",
    client: {
      name: "FitLife Apps",
      avatar: "/placeholder-user.jpg",
      rating: 4.6,
    },
    applicants: 20,
    tags: ["Mobile Design", "iOS", "Android", "Prototyping"],
  },
  {
    id: "5",
    title: "Smart Contract Development",
    description:
      "Looking for a blockchain developer to create smart contracts for a DeFi protocol. Experience with Solidity and Web3 technologies required.",
    category: "Blockchain",
    reward: 2000,
    currency: "XDC",
    deadline: "in 3 weeks",
    location: "Remote",
    client: {
      name: "DeFi Innovations",
      avatar: "/placeholder-user.jpg",
      rating: 5.0,
    },
    applicants: 5,
    tags: ["Solidity", "Smart Contracts", "DeFi", "Web3"],
  },
  {
    id: "6",
    title: "Video Editing for YouTube Channel",
    description:
      "Edit weekly videos for a tech YouTube channel. Need someone who can create engaging content with motion graphics, transitions, and color grading.",
    category: "Video",
    reward: 300,
    currency: "XDC",
    deadline: "in 3 days",
    location: "Remote",
    client: {
      name: "TechTuber",
      avatar: "/placeholder-user.jpg",
      rating: 4.5,
    },
    applicants: 18,
    tags: ["Video Editing", "Motion Graphics", "YouTube", "After Effects"],
  },
]

const categories = ["All", "Design", "Development", "Writing", "Blockchain", "Video", "Marketing"]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || task.category === selectedCategory

    return matchesSearch && matchesCategory
  })

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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Task Marketplace</h1>
          <p className="text-muted-foreground">Discover opportunities and connect with clients worldwide</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks, skills, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48 h-12">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest-reward">Highest Reward</SelectItem>
                    <SelectItem value="lowest-reward">Lowest Reward</SelectItem>
                    <SelectItem value="most-applicants">Most Applicants</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedCategory === category
                        ? "bg-apple-blue hover:bg-apple-blue/90"
                        : "hover:bg-apple-blue/10 hover:text-apple-blue hover:border-apple-blue"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-sm text-muted-foreground">
            Showing {filteredTasks.length} of {mockTasks.length} tasks
          </p>
        </motion.div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
        </div>

        {/* Load More */}
        {filteredTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-apple-blue/10 hover:text-apple-blue hover:border-apple-blue"
            >
              Load More Tasks
            </Button>
          </motion.div>
        )}

        {/* No Results */}
        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse different categories
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
