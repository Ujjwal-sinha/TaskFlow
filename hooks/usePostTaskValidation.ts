import { ethers } from 'ethers'
import { FormData, ValidationResult } from '@/components/post-task/types'
import { MIN_TITLE_LENGTH, MIN_DESCRIPTION_LENGTH, MIN_BUDGET } from '@/components/post-task/constants'

export const usePostTaskValidation = () => {
  const validateStep = (currentStep: number, formData: FormData, isConnected: boolean, currentAccount: string | null): ValidationResult => {
    switch (currentStep) {
      case 1:
        const titleValid = formData.title.trim().length >= MIN_TITLE_LENGTH
        const descValid = formData.description.trim().length >= MIN_DESCRIPTION_LENGTH
        const categoryValid = formData.category.trim().length > 0
        
        if (!formData.title.trim()) return { isValid: false, message: "Please enter a task title" }
        if (!titleValid) return { isValid: false, message: `Title should be at least ${MIN_TITLE_LENGTH} characters` }
        if (!formData.description.trim()) return { isValid: false, message: "Please enter a task description" }
        if (!descValid) return { isValid: false, message: `Description should be at least ${MIN_DESCRIPTION_LENGTH} characters` }
        if (!formData.category) return { isValid: false, message: "Please select a category" }
        
        return { isValid: titleValid && descValid && categoryValid, message: "" }
        
      case 2:
        return { isValid: true, message: "" } // Skills and files are optional
        
      case 3:
        const budgetValid = formData.budget && Number(formData.budget) >= MIN_BUDGET
        const timelineValid = formData.timeline && formData.timeline.trim().length > 0
        
        if (!formData.budget) return { isValid: false, message: "Please enter a budget" }
        if (!budgetValid) return { isValid: false, message: `Minimum budget is ${MIN_BUDGET} XDC` }
        if (!formData.timeline) return { isValid: false, message: "Please select a timeline" }
        
        return { isValid: budgetValid && timelineValid, message: "" }
        
      case 4:
        const walletConnected = isConnected && currentAccount
        
        if (!walletConnected) return { isValid: false, message: "Please connect your MetaMask wallet" }
        
        return { isValid: true, message: "" }
        
      default:
        return { isValid: true, message: "" }
    }
  }

  const validateFormData = (formData: FormData): ValidationResult => {
    // Final validation before submission
    if (!formData.title || !formData.description || !formData.category || !formData.budget || !formData.timeline) {
      return { isValid: false, message: "Please fill in all required fields." }
    }

    if (Number(formData.budget) < MIN_BUDGET) {
      return { isValid: false, message: `Minimum budget requirement is ${MIN_BUDGET} XDC.` }
    }

    return { isValid: true, message: "" }
  }

  return {
    validateStep,
    validateFormData
  }
} 