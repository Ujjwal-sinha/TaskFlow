import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Sparkles } from 'lucide-react'
import { PostTaskProps, AISuggestions } from './types'
import { usePostTaskValidation } from '@/hooks/usePostTaskValidation'
import { useToast } from '@/hooks/use-toast'

interface Step3Props extends PostTaskProps {}

export const Step3BudgetTimeline: React.FC<Step3Props> = ({ 
  formData, 
  setFormData,
  currentStep 
}) => {
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [platformFee] = useState(0.05) // Default 5%
  const { toast } = useToast()
  const { validateStep } = usePostTaskValidation()
  
  const validation = validateStep(currentStep, formData, false, null)

  // Get AI suggestions for task requirements
  const getAISuggestions = async () => {
    if (!formData.title || !formData.description || !formData.category) return

    try {
      setLoadingAI(true)
      const params = new URLSearchParams({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills: formData.skills.join(','),
      })

      const response = await fetch(`/api/ai-suggestions?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch AI suggestions')
      }
      const suggestions = await response.json()
      setAiSuggestions(suggestions)
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
      toast({
        title: "AI Suggestions Error",
        description: "Failed to load AI suggestions. Please proceed without them.",
        variant: "destructive",
      })
    } finally {
      setLoadingAI(false)
    }
  }

  // Trigger AI suggestions when component loads with data
  useEffect(() => {
    if (formData.title && formData.description && formData.category) {
      getAISuggestions()
    }
  }, [formData.title, formData.description, formData.category, formData.skills])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {(loadingAI || aiSuggestions) && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-purple-800">AI Insights</h3>
          </div>
          
          {loadingAI ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm text-purple-700">Analyzing your task requirements...</p>
            </div>
          ) : aiSuggestions ? (
            <div className="space-y-3">
              {aiSuggestions?.suggestions && aiSuggestions.suggestions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-purple-800 mb-1">Suggestions:</p>
                  <ul className="text-sm text-purple-700 space-y-1 list-disc pl-5">
                    {aiSuggestions.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {aiSuggestions.estimatedBudget && (
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    Estimated Budget: {aiSuggestions.estimatedBudget.min} - {aiSuggestions.estimatedBudget.max} XDC
                  </p>
                </div>
              )}
              
              {aiSuggestions.estimatedDuration && (
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    Estimated Duration: {aiSuggestions.estimatedDuration}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      <div>
        <Label htmlFor="budget" className="text-base font-medium">
          Budget (XDC) *
        </Label>
        <Input
          id="budget"
          type="number"
          min="1"
          placeholder="e.g., 500"
          value={formData.budget}
          onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
          className="mt-2 h-12 rounded-md"
          required
          aria-required="true"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Set a competitive budget to attract quality freelancers
        </p>
      </div>

      <div>
        <Label className="text-base font-medium">Timeline *</Label>
        <Select
          value={formData.timeline}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, timeline: value }))}
          required
          aria-required="true"
        >
          <SelectTrigger className="mt-2 h-12 rounded-md" aria-label="Select timeline">
            <SelectValue placeholder="Select timeline" />
          </SelectTrigger>
          <SelectContent className="rounded-md">
            <SelectItem value="1-3-days">1-3 days</SelectItem>
            <SelectItem value="1-week">1 week</SelectItem>
            <SelectItem value="2-weeks">2 weeks</SelectItem>
            <SelectItem value="1-month">1 month</SelectItem>
            <SelectItem value="2-3-months">2-3 months</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Payment Terms</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Task Budget:</span>
            <span className="font-medium">{formData.budget || "0"} XDC</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee ({platformFee * 100}%):</span>
            <span className="font-medium">
              {formData.budget ? (Number(formData.budget) * platformFee).toFixed(2) : "0"} XDC
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total Cost:</span>
            <span>{formData.budget ? (Number(formData.budget) * (1 + platformFee)).toFixed(2) : "0"} XDC</span>
          </div>
        </div>
      </div>

      {/* Validation Message Display */}
      {!validation.isValid && validation.message && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{validation.message}</p>
        </div>
      )}
    </motion.div>
  )
}