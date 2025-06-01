"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"

const categories = [
  "All", "Design", "Development", "Writing", "Blockchain", 
  "Video", "Marketing", "Audio", "Business", "Data", "Translation"
]

interface TasksFiltersProps {
  searchQuery: string
  selectedCategory: string
  sortBy: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSortChange: (value: string) => void
}

export function TasksFilters({
  searchQuery,
  selectedCategory,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange
}: TasksFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-6"
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-background border-0 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="bg-background border-0 shadow-sm focus:ring-1 focus:ring-blue-500">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="lg:w-40">
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="bg-background border-0 shadow-sm focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="reward-high">Highest Reward</SelectItem>
                  <SelectItem value="reward-low">Lowest Reward</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 