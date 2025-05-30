"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin, Star, Users } from "lucide-react"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    category: string
    reward: number
    currency: string
    deadline: string
    location: string
    client: {
      name: string
      avatar: string
      rating: number
    }
    applicants: number
    tags: string[]
  }
  index: number
}

export function TaskCard({ task, index }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full border-0 shadow-apple hover:shadow-apple-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Badge variant="secondary" className="mb-2">
              {task.category}
            </Badge>
            <div className="text-right">
              <div className="text-lg font-bold text-apple-green">
                {task.reward} {task.currency}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold line-clamp-2 leading-tight">{task.title}</h3>
        </CardHeader>

        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{task.description}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-2 h-3 w-3" />
              <span>Due {task.deadline}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-3 w-3" />
              <span>{task.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-3 w-3" />
              <span>{task.applicants} applicants</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.client.avatar || "/placeholder.svg"} alt={task.client.name} />
                <AvatarFallback className="text-xs">{task.client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium">{task.client.name}</span>
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-apple-yellow text-apple-yellow" />
                  <span className="text-xs text-muted-foreground ml-1">{task.client.rating}</span>
                </div>
              </div>
            </div>
            <Button size="sm" className="bg-apple-blue hover:bg-apple-blue/90">
              Apply
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
