"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin, Star, Users, TrendingUp, Zap, Briefcase } from "lucide-react"
import { TaskProposalModal } from "./TaskProposalModal"
import { useTaskEscrow } from "@/hooks/useTaskEscrow"

interface TaskCardProps {
  task: {
    _id: string
    title: string
    description: string
    category: string
    reward: number
    currency: string
    deadline: string
    location: string
    client: {
      id?: string
      name: string
      avatar: string
      rating: number
      address?: string
    }
    applicants: number
    tags: string[]
    status?: string
    createdAt?: string
    skills?: string[]
  }
  index: number
  onApplicationSubmitted?: () => void
  isTaskCreator?: boolean
}

export function TaskCard({ task, index, onApplicationSubmitted, isTaskCreator }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { currentAccount } = useTaskEscrow(process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS)

  const handleApplyClick = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleApplicationSubmitted = () => {
    if (onApplicationSubmitted) {
      onApplicationSubmitted()
    }
    setIsModalOpen(false)
  }

  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      rotateX: 15
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full cursor-pointer group perspective-1000"
      >
        <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm overflow-hidden relative group">
          {/* Gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 z-0"
            variants={overlayVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
          />

          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-start justify-between">
              <motion.div
                className="mb-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-300"
                >
                  {task.category}
                </Badge>
              </motion.div>
              <motion.div 
                className="text-right"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {task.reward} {task.currency}
                </div>
                {task.applicants < 5 && (
                  <motion.div
                    className="flex items-center text-xs text-orange-600 mt-1"
                    animate={{ x: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Hot!</span>
                  </motion.div>
                )}
              </motion.div>
            </div>
            <motion.h3 
              className="text-lg font-semibold line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors duration-300"
              layout
            >
              {task.title}
            </motion.h3>
          </CardHeader>

          <CardContent className="pb-4 relative z-10">
            <motion.p 
              className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed"
              layout
            >
              {task.description}
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-2 mb-4"
              layout
            >
              {task.tags.slice(0, 3).map((tag, tagIndex) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (index * 0.1) + (tagIndex * 0.1) }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-white/60 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
              {task.tags.length > 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (index * 0.1) + 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300"
                  >
                    +{task.tags.length - 3}
                  </Badge>
                </motion.div>
              )}
            </motion.div>

            <div className="space-y-3 text-xs text-muted-foreground">
              <motion.div 
                className="flex items-center bg-white/30 rounded-lg p-2 hover:bg-white/50 transition-all duration-300"
                whileHover={{ x: 4 }}
              >
                <Clock className="mr-2 h-3 w-3 text-orange-500" />
                <span>Due {task.deadline}</span>
              </motion.div>
              <motion.div 
                className="flex items-center bg-white/30 rounded-lg p-2 hover:bg-white/50 transition-all duration-300"
                whileHover={{ x: 4 }}
              >
                <MapPin className="mr-2 h-3 w-3 text-blue-500" />
                <span>{task.location}</span>
              </motion.div>
              <motion.div 
                className="flex items-center bg-white/30 rounded-lg p-2 hover:bg-white/50 transition-all duration-300"
                whileHover={{ x: 4 }}
              >
                <Users className="mr-2 h-3 w-3 text-purple-500" />
                <span>{task.applicants} applicants</span>
                {task.applicants > 10 && (
                  <motion.div
                    className="ml-2"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Zap className="h-3 w-3 text-yellow-500" />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </CardContent>

          <CardFooter className="pt-0 relative z-10">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Avatar className="h-8 w-8 border-2 border-white shadow-md">
                    <AvatarImage src={task.client.avatar || "/placeholder.svg"} alt={task.client.name} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100 to-purple-100">
                      {task.client.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <motion.span 
                    className="text-xs font-medium hover:text-blue-600 transition-colors duration-300"
                    whileHover={{ x: 2 }}
                  >
                    {task.client.name}
                  </motion.span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <motion.span 
                      className="text-xs text-muted-foreground ml-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      {task.client.rating.toFixed(1)}
                    </motion.span>
                  </div>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg rounded-lg px-6 py-2 font-medium"
                  onClick={handleApplyClick}
                >
                  Apply
                </Button>
              </motion.div>
            </div>
          </CardFooter>

          {/* Subtle border glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 -z-10"
            animate={{ 
              opacity: isHovered ? 0.1 : 0,
              scale: isHovered ? 1.01 : 1
            }}
            transition={{ duration: 0.3 }}
          />
        </Card>
      </motion.div>

      <TaskProposalModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        task={{
          _id: task._id,
          title: task.title,
          description: task.description,
          category: task.category,
          reward: task.reward,
          currency: task.currency,
          deadline: task.deadline,
          skills: task.skills || [],
          poster: {
            address: task.client.id || task.client.address || '',
            name: task.client.name
          }
        }}
        currentUserAddress={currentAccount || undefined}
        isTaskOwner={isTaskCreator}
      />
    </>
  )
}
