"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  Loader2, 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Sparkles,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTaskEscrow } from "@/hooks/useTaskEscrow"

interface Task {
  _id: string
  title: string
  description: string
  category: string
  reward: number
  currency: string
  deadline: string
  skills: string[]
  poster?: {
    address: string
    name: string
  }
}

interface Proposal {
  _id: string
  proposerAddress: string
  proposerName: string
  proposerAvatar?: string
  proposerRating: number
  proposal: string
  bidAmount: number
  estimatedDuration: string
  deliverables: string[]
  status: string
  createdAt: string
  aiAnalysis?: {
    matchScore: number
    reason: string
    strengths: string[]
    concerns: string[]
  }
}

interface AISuggestion {
  id: string
  proposal: string
  bidAmount: number
  estimatedDuration: string
  deliverables: string[]
  reasoning: string
  confidence: number
  type: string
  metadata?: {
    approach: string
  }
}

interface TaskProposalModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  currentUserAddress?: string
  isTaskOwner?: boolean
}

export function TaskProposalModal({ 
  isOpen, 
  onClose, 
  task, 
  currentUserAddress,
  isTaskOwner = false 
}: TaskProposalModalProps) {
  const { toast } = useToast()
  const { assignTask, completeTask } = useTaskEscrow()
  
  // States
  const [activeTab, setActiveTab] = useState(isTaskOwner ? "proposals" : "submit")
  const [loading, setLoading] = useState(false)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [aiSuggestions, setAISuggestions] = useState<AISuggestion[]>([])
  const [proposalsLoading, setProposalsLoading] = useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    proposal: '',
    bidAmount: '',
    estimatedDuration: '',
    deliverables: ['']
  })

  // Fetch proposals when modal opens
  useEffect(() => {
    if (isOpen && task) {
      fetchProposals()
      if (isTaskOwner) {
        fetchAISuggestions()
      }
    }
  }, [isOpen, task])

  const fetchProposals = async () => {
    if (!task) return
    
    setProposalsLoading(true)
    try {
      const response = await fetch(`/api/tasks/${task._id}/proposals`)
      const data = await response.json()
      
      if (data.success) {
        setProposals(data.proposals)
      }
    } catch (error) {
      console.error('Error fetching proposals:', error)
    } finally {
      setProposalsLoading(false)
    }
  }

  const fetchAISuggestions = async () => {
    if (!task) return
    
    setSuggestionsLoading(true)
    try {
      const response = await fetch(`/api/tasks/${task._id}/ai-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDetails: {
            title: task.title,
            description: task.description,
            category: task.category,
            skills: task.skills,
            reward: task.reward,
            deadline: task.deadline
          }
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setAISuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Error fetching AI suggestions:', error)
    } finally {
      setSuggestionsLoading(false)
    }
  }

  const submitProposal = async () => {
    if (!task || !currentUserAddress) return

    setLoading(true)
    try {
      const response = await fetch(`/api/tasks/${task._id}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposerAddress: currentUserAddress,
          proposerName: 'Current User', // You might want to get this from user context
          proposal: formData.proposal,
          bidAmount: parseFloat(formData.bidAmount),
          estimatedDuration: formData.estimatedDuration,
          deliverables: formData.deliverables.filter(d => d.trim()),
          taskDetails: {
            title: task.title,
            description: task.description,
            category: task.category,
            skills: task.skills,
            reward: task.reward,
            deadline: task.deadline
          }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Proposal Submitted! 🎉",
          description: "Your proposal has been submitted and analyzed by AI.",
        })
        
        // Reset form
        setFormData({
          proposal: '',
          bidAmount: '',
          estimatedDuration: '',
          deliverables: ['']
        })
        
        // Refresh proposals
        fetchProposals()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit proposal",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const selectProposal = async (proposal: Proposal) => {
    if (!task || !currentUserAddress) return

    setLoading(true)
    try {
      // First, update proposal status in database
      const response = await fetch(`/api/tasks/${task._id}/proposals/${proposal._id}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientAddress: currentUserAddress
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Now assign task on blockchain
        await assignTask(parseInt(task._id), proposal.proposerAddress)
        
        toast({
          title: "Proposal Selected! ✅",
          description: `Task assigned to ${proposal.proposerName} on blockchain`,
        })
        
        fetchProposals() // Refresh to show updated statuses
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Selection Failed",
        description: error.message || "Failed to select proposal",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const markTaskComplete = async () => {
    if (!task || !currentUserAddress) return

    setLoading(true)
    try {
      // First complete on blockchain
      const txHash = await completeTask(parseInt(task._id))
      
      // Then update database with completion details
      const response = await fetch(`/api/tasks/${task._id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientAddress: currentUserAddress,
          transactionHash: txHash,
          blockchainCompleted: true
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Task Completed! 🎉",
          description: "Payment has been released to the freelancer",
        })
        
        onClose()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Completion Failed",
        description: error.message || "Failed to complete task",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }))
  }

  const updateDeliverable = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((d, i) => i === index ? value : d)
    }))
  }

  const removeDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }))
  }

  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{task.title}</span>
            <Badge variant="secondary">{task.category}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>{task.reward} {task.currency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>{task.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>{proposals.length} proposals</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="submit" disabled={isTaskOwner}>
                Submit Proposal
              </TabsTrigger>
              <TabsTrigger value="proposals">
                View Proposals ({proposals.length})
              </TabsTrigger>
              {isTaskOwner && (
                <TabsTrigger value="ai-suggestions">
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI Suggestions
                </TabsTrigger>
              )}
            </TabsList>

            {/* Submit Proposal Tab */}
            {!isTaskOwner ? (
              <TabsContent value="submit" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Proposal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Proposal</label>
                      <Textarea
                        placeholder="Describe your approach, experience, and why you're the best fit for this task..."
                        value={formData.proposal}
                        onChange={(e) => setFormData(prev => ({ ...prev, proposal: e.target.value }))}
                        rows={6}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Bid Amount ({task.currency})</label>
                        <Input
                          type="number"
                          placeholder="Enter your bid"
                          value={formData.bidAmount}
                          onChange={(e) => setFormData(prev => ({ ...prev, bidAmount: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Estimated Duration</label>
                        <Input
                          placeholder="e.g., 2-3 weeks"
                          value={formData.estimatedDuration}
                          onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Deliverables</label>
                      {formData.deliverables.map((deliverable, index) => (
                        <div key={index} className="flex gap-2 mt-2">
                          <Input
                            placeholder="What will you deliver?"
                            value={deliverable}
                            onChange={(e) => updateDeliverable(index, e.target.value)}
                          />
                          {formData.deliverables.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeDeliverable(index)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addDeliverable}
                        className="mt-2"
                      >
                        Add Deliverable
                      </Button>
                    </div>

                    <Button
                      onClick={submitProposal}
                      disabled={loading || !formData.proposal || !formData.bidAmount}
                      className="w-full"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Submit Proposal
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            ) : (
              <TabsContent value="submit" className="space-y-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">You Own This Task</h3>
                    <p className="text-muted-foreground mb-4">
                      Task owners cannot submit proposals to their own tasks. You can view incoming proposals in the "View Proposals" tab and see AI-generated suggestions for what good proposals look like.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("proposals")}
                      >
                        View Proposals
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("ai-suggestions")}
                      >
                        AI Suggestions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Proposals Tab */}
            <TabsContent value="proposals" className="space-y-4">
              {proposalsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : proposals.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Proposals Yet</h3>
                    <p className="text-muted-foreground">Be the first to submit a proposal for this task!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <Card key={proposal._id} className="relative">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={proposal.proposerAvatar} />
                              <AvatarFallback>
                                {proposal.proposerName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{proposal.proposerName}</h4>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-muted-foreground">
                                  {proposal.proposerRating || 'New'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              proposal.status === 'selected' ? 'default' :
                              proposal.status === 'rejected' ? 'destructive' : 'secondary'
                            }>
                              {proposal.status}
                            </Badge>
                            {proposal.aiAnalysis && (
                              <Badge variant="outline" className="bg-purple-50">
                                AI: {proposal.aiAnalysis.matchScore}%
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          {proposal.proposal}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span>{proposal.bidAmount} XDC</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>{proposal.estimatedDuration}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(proposal.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {proposal.deliverables.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium mb-2">Deliverables:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {proposal.deliverables.map((deliverable, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {proposal.aiAnalysis && (
                          <div className="border-t pt-4 mt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium">AI Analysis</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {proposal.aiAnalysis.reason}
                            </p>
                            {proposal.aiAnalysis.strengths.length > 0 && (
                              <div className="text-xs">
                                <span className="font-medium text-green-700">Strengths: </span>
                                {proposal.aiAnalysis.strengths.join(', ')}
                              </div>
                            )}
                            {proposal.aiAnalysis.concerns.length > 0 && (
                              <div className="text-xs mt-1">
                                <span className="font-medium text-orange-700">Concerns: </span>
                                {proposal.aiAnalysis.concerns.join(', ')}
                              </div>
                            )}
                          </div>
                        )}

                        {isTaskOwner && proposal.status === 'pending' && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => selectProposal(proposal)}
                              disabled={loading}
                              size="sm"
                            >
                              {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Select Proposal
                            </Button>
                          </div>
                        )}

                        {isTaskOwner && proposal.status === 'selected' && (
                          <div className="mt-4">
                            <Button
                              onClick={markTaskComplete}
                              disabled={loading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Mark Task Complete & Release Payment
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* AI Suggestions Tab */}
            {isTaskOwner && (
              <TabsContent value="ai-suggestions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      AI-Generated Proposal Examples
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      These AI-generated proposals show what quality submissions might look like for your task.
                    </p>
                  </CardHeader>
                </Card>

                {suggestionsLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiSuggestions.map((suggestion, index) => (
                      <Card key={suggestion.id} className="border-purple-200">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">
                              AI {suggestion.metadata?.approach || 'Generated'}
                            </Badge>
                            <Badge variant="outline">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {suggestion.confidence}% Confidence
                            </Badge>
                          </div>

                          <p className="text-sm mb-4">{suggestion.proposal}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span>{suggestion.bidAmount} XDC</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span>{suggestion.estimatedDuration}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h5 className="text-sm font-medium mb-2">Suggested Deliverables:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {suggestion.deliverables.map((deliverable, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium">AI Reasoning</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {suggestion.reasoning}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
} 