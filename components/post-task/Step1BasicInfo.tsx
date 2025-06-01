import React from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PostTaskProps } from './types'
import { CATEGORIES } from './constants'
import { usePostTaskValidation } from '@/hooks/usePostTaskValidation'

interface Step1Props extends PostTaskProps {}

export const Step1BasicInfo: React.FC<Step1Props> = ({ 
  formData, 
  setFormData, 
  currentStep 
}) => {
  const { validateStep } = usePostTaskValidation()
  const validation = validateStep(currentStep, formData, false, null)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="title" className="text-base font-medium flex items-center">
          Task Title *
          <span className="ml-2 text-sm text-muted-foreground">
            ({formData.title.length}/100 characters)
          </span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Design a modern landing page for my SaaS product"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ 
            ...prev, 
            title: e.target.value.slice(0, 100) 
          }))}
          className="mt-2 h-12 rounded-md"
          required
          aria-required="true"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Write a clear, descriptive title that explains what you need
        </p>
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-medium flex items-center">
          Description *
          <span className="ml-2 text-sm text-muted-foreground">
            ({formData.description.length}/2000 characters)
          </span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your project in detail. Include requirements, expectations, and any specific instructions..."
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ 
            ...prev, 
            description: e.target.value.slice(0, 2000) 
          }))}
          className="mt-2 min-h-32 rounded-md"
          required
          aria-required="true"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Provide detailed information to help freelancers understand your needs
        </p>
      </div>

      <div>
        <Label className="text-base font-medium">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          required
          aria-required="true"
        >
          <SelectTrigger className="mt-2 h-12 rounded-md" aria-label="Select a category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="rounded-md">
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          Choose the category that best fits your task
        </p>
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