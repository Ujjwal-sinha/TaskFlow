"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Clock, 
  MapPin, 
  Star, 
  Users, 
  DollarSign, 
  Sparkles,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Eye,
  Award,
  Zap,
  Briefcase
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useTaskEscrow } from '@/hooks/useTaskEscrow'
import { useUser } from '@civic/auth-web3/react'

interface TaskDetailModalProps {
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
    }
    applicants: number
    tags: string[]
    status?: string
    createdAt?: string
    skills?: string[]
  } | null
  isOpen: boolean
  onClose: () => void
  onApplicationSubmitted?: () => void
}

export function TaskDetailModal({ 
  task, 
  isOpen, 
  onClose, 
  onApplicationSubmitted 
}: TaskDetailModalProps) {
  const { toast } = useToast()
  const { user } = useUser()
  const { isConnected, currentAccount, connect } = useTaskEscrow(
    process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS
  )

  const [proposal, setProposal] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)

  if (!task) return null

  // Check if current user is the task creator
  const isTaskCreator = currentAccount && task.client.id && 
    (task.client.id.toLowerCase() === currentAccount.toLowerCase() || 
     task.client.address?.toLowerCase() === currentAccount.toLowerCase())

  const handleApply = async () => {
    if (!isConnected || !currentAccount) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to apply for this task",
        variant: "destructive",
      })
      return
    }

    if (!proposal.trim()) {
      toast({
        title: "Proposal Required",
        description: "Please write a proposal explaining why you're the best fit",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/tasks/${task._id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposal: proposal.trim(),
          bidAmount: bidAmount ? parseFloat(bidAmount) : undefined,
          freelancerAddress: currentAccount,
          freelancerName: user?.name || user?.displayName || `User ${currentAccount.substring(0, 6)}`,
          freelancerAvatar: user?.avatar || '/placeholder-user.jpg',
          freelancerRating: user?.rating || 0
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit application')
      }

      const result = await response.json()
      setApplicationSuccess(true)
      setAiAnalysis(result.application.aiAnalysis)
      
      toast({
        title: "Application Submitted! ✨",
        description: `Your proposal has been sent to the client. AI Match Score: ${result.application.aiAnalysis.matchScore || 0}%`,
      })

      if (onApplicationSubmitted) {
        onApplicationSubmitted()
      }

    } catch (error: any) {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setProposal('')
    setBidAmount('')
    setApplicationSuccess(false)
    setAiAnalysis(null)
    onClose()
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogHeader className="space-y-4">
                <motion.div variants={childVariants} className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-bold leading-tight pr-4">
                      {task.title}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-3 mt-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
                      >
                        {task.category}
                      </Badge>
                      <motion.span 
                        className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {task.reward} {task.currency}
                      </motion.span>
                    </DialogDescription>
                  </div>
                </motion.div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Task Details */}
                <motion.div variants={childVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <motion.div
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-6 shadow-sm"
                      whileHover={{ 
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        y: -2
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-500" />
                        Description
                      </h3>
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {task.description}
                      </p>
                    </motion.div>

                    {task.skills && task.skills.length > 0 && (
                      <motion.div
                        className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-6 shadow-sm"
                        whileHover={{ 
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          y: -2
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-500" />
                          Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {task.skills.map((skill, index) => (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Badge 
                                variant="outline" 
                                className="bg-white/80 backdrop-blur-sm hover:bg-purple-100 hover:border-purple-300 transition-all duration-300"
                              >
                                {skill}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {task.tags && task.tags.length > 0 && (
                      <motion.div
                        className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6 shadow-sm"
                        whileHover={{ 
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          y: -2
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-green-500" />
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {task.tags.map((tag, index) => (
                            <motion.div
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Badge 
                                variant="secondary" 
                                className="text-xs bg-white/80 backdrop-blur-sm hover:bg-green-100 hover:border-green-300 transition-all duration-300"
                              >
                                {tag}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <motion.div 
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm"
                      whileHover={{ 
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        y: -2
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <h4 className="font-semibold mb-4 text-blue-800">Task Details</h4>
                      <div className="space-y-4">
                        <motion.div 
                          className="flex items-center text-sm bg-white/60 rounded-lg p-3"
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                        >
                          <DollarSign className="mr-3 h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-700">{task.reward} {task.currency}</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center text-sm bg-white/60 rounded-lg p-3"
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                        >
                          <Clock className="mr-3 h-4 w-4 text-orange-500" />
                          <span>Due {task.deadline}</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center text-sm bg-white/60 rounded-lg p-3"
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                        >
                          <MapPin className="mr-3 h-4 w-4 text-blue-500" />
                          <span>{task.location}</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center text-sm bg-white/60 rounded-lg p-3"
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                        >
                          <Users className="mr-3 h-4 w-4 text-purple-500" />
                          <span>{task.applicants} applicants</span>
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-6 shadow-sm"
                      whileHover={{ 
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        y: -2
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <h4 className="font-semibold mb-4">Client</h4>
                      <div className="flex items-center space-x-3">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                            <AvatarImage src={task.client.avatar} alt={task.client.name} />
                            <AvatarFallback>
                              <User className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <div>
                          <p className="font-medium">{task.client.name}</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm text-muted-foreground">
                              {task.client.rating === 0 ? 'New' : task.client.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Application Section */}
                <motion.div variants={childVariants}>
                  {isTaskCreator ? (
                    <div className="border-t pt-6">
                      <motion.div 
                        className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                        whileHover={{ 
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          y: -2
                        }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <Briefcase className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                        </motion.div>
                        <h4 className="font-semibold mb-2 text-blue-800">This is Your Task</h4>
                        <p className="text-blue-700 mb-6">
                          You cannot apply to your own task. View your applicants in the dashboard.
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            onClick={handleClose}
                            className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                            size="lg"
                          >
                            Close
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  ) : !applicationSuccess ? (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Send className="h-5 w-5 text-blue-500" />
                        Submit Your Application
                      </h3>
                      
                      {!isConnected ? (
                        <motion.div 
                          className="text-center py-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100"
                          whileHover={{ 
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                            y: -2
                          }}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          >
                            <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                          </motion.div>
                          <h4 className="font-semibold mb-2 text-orange-800">Connect Your Wallet</h4>
                          <p className="text-orange-700 mb-6">
                            Connect your MetaMask wallet to apply for this task
                          </p>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              onClick={connect} 
                              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                              size="lg"
                            >
                              Connect Wallet
                            </Button>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <div className="space-y-6">
                          <motion.div 
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="flex items-center gap-3">
                              <motion.div
                                className="h-3 w-3 bg-green-500 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              />
                              <span className="text-sm font-medium text-blue-800">
                                Connected as: {currentAccount?.substring(0, 6)}...{currentAccount?.slice(-4)}
                              </span>
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Label htmlFor="proposal" className="text-base font-medium">Your Proposal *</Label>
                            <Textarea
                              id="proposal"
                              placeholder="Explain why you're the perfect fit for this project. Include your relevant experience, approach, and timeline..."
                              value={proposal}
                              onChange={(e) => setProposal(e.target.value)}
                              rows={6}
                              className="mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 rounded-xl"
                            />
                            <motion.p 
                              className="text-xs text-muted-foreground mt-2"
                              animate={{ 
                                color: proposal.length > 800 ? '#ef4444' : '#6b7280' 
                              }}
                            >
                              {proposal.length}/1000 characters
                            </motion.p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Label htmlFor="bidAmount" className="text-base font-medium">Your Bid (XDC) - Optional</Label>
                            <Input
                              id="bidAmount"
                              type="number"
                              step="0.01"
                              placeholder={`Default: ${task.reward} XDC`}
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              className="mt-2 border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 rounded-xl"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                              Leave empty to bid the original amount
                            </p>
                          </motion.div>

                          <motion.div 
                            className="flex gap-3 pt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.div
                              className="flex-1"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={handleApply}
                                disabled={isSubmitting || !proposal.trim()}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg rounded-xl h-12"
                                size="lg"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Application
                                  </>
                                )}
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button variant="outline" onClick={handleClose} className="rounded-xl h-12 px-6">
                                Cancel
                              </Button>
                            </motion.div>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border-t pt-6"
                    >
                      <motion.div 
                        className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20,
                            delay: 0.3
                          }}
                        >
                          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                        </motion.div>
                        <motion.h3 
                          className="text-2xl font-bold text-green-800 mb-3"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          Application Submitted Successfully!
                        </motion.h3>
                        <motion.p 
                          className="text-green-700 mb-6"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          Your proposal has been sent to the client. You'll be notified if you're selected.
                        </motion.p>
                        
                        {aiAnalysis && (
                          <motion.div 
                            className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 max-w-md mx-auto mb-6"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <Sparkles className="h-5 w-5 text-purple-600" />
                              <span className="font-semibold text-purple-800">AI Analysis</span>
                            </div>
                            <div className="text-center">
                              <motion.div 
                                className="text-3xl font-bold text-purple-700 mb-2"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                              >
                                {aiAnalysis.matchScore || 0}%
                              </motion.div>
                              <p className="text-sm text-purple-600 mb-3">Match Score</p>
                              {aiAnalysis.reason && (
                                <motion.p 
                                  className="text-xs text-purple-700 italic"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1 }}
                                >
                                  "{aiAnalysis.reason}"
                                </motion.p>
                              )}
                            </div>
                          </motion.div>
                        )}

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Button onClick={handleClose} className="rounded-xl" size="lg">
                            Close
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
} 