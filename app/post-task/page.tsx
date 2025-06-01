"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/custom/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useUser } from "@civic/auth-web3/react"

// Import modular components and hooks
import { FormData } from "@/components/post-task/types"
import { STEPS } from "@/components/post-task/constants"
import { Step1BasicInfo } from "@/components/post-task/Step1BasicInfo"
import { Step2Details } from "@/components/post-task/Step2Details"
import { Step3BudgetTimeline } from "@/components/post-task/Step3BudgetTimeline"
import { Step4WalletConnect } from "@/components/post-task/Step4WalletConnect"
import { Step5Preview } from "@/components/post-task/Step5Preview"
import { useTaskEscrow } from '@/hooks/useTaskEscrow'
import { usePostTaskValidation } from '@/hooks/usePostTaskValidation'
import { usePostTaskSubmission } from '@/hooks/usePostTaskSubmission'
import { useToast } from "@/hooks/use-toast"

export default function PostTaskPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  
  // Web3 integration
  const {
    isConnected,
    currentAccount,
  } = useTaskEscrow(process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS)

  // Custom hooks
  const { validateStep } = usePostTaskValidation()
  const { submitTask, isSubmitting } = usePostTaskSubmission()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a task",
        variant: "destructive"
      })
    }
  }, [user, isLoading, router, toast])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-3 bg-background/95 p-4 rounded-lg shadow-lg">
          <Loader2 className="h-5 w-5 animate-spin text-apple-blue" />
          <p className="font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    skills: [],
    budget: "",
    timeline: "",
    files: [],
  })

  const progress = (currentStep / STEPS.length) * 100

  // Validate current step for enabling/disabling Next button
  const isStepValid = () => {
    const validation = validateStep(currentStep, formData, isConnected, currentAccount)
    return validation.isValid
  }

  const handleNext = () => {
    if (currentStep < STEPS.length && isStepValid()) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset the form? All progress will be lost.')) {
      setFormData({
        title: "",
        description: "",
        category: "",
        skills: [],
        budget: "",
        timeline: "",
        files: [],
      })
      setCurrentStep(1)
      toast({
        title: "Form Reset",
        description: "The form has been reset.",
      })
    }
  }

  const handleSubmit = async () => {
    await submitTask(formData, isConnected, currentAccount, user)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            isSubmitting={isSubmitting}
          />
        )

      case 2:
        return (
          <Step2Details
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            isSubmitting={isSubmitting}
          />
        )

      case 3:
        return (
          <Step3BudgetTimeline
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            isSubmitting={isSubmitting}
          />
        )

      case 4:
        return (
          <Step4WalletConnect
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            isSubmitting={isSubmitting}
          />
        )

      case 5:
        return (
          <Step5Preview
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            isSubmitting={isSubmitting}
          />
        )

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Step {currentStep} component not yet implemented.</p>
          </div>
        )
    }
  }

  const CurrentStepIcon = STEPS[currentStep - 1].icon
  const currentStepTitle = STEPS[currentStep - 1].title

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">Post a New Task</h1>
          <p className="text-muted-foreground">Tell us about your project and find the perfect freelancer</p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep >= step.id
                      ? "bg-apple-blue border-apple-blue text-white"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                  aria-current={currentStep === step.id ? "step" : undefined}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-apple-blue" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-12 h-px mx-4 ${currentStep > step.id ? "bg-apple-blue" : "bg-muted-foreground/30"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CurrentStepIcon className="mr-2 h-5 w-5" />
                {currentStepTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || isSubmitting}
                    className="flex items-center rounded-md"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="text-muted-foreground rounded-md"
                    aria-label="Reset form"
                  >
                    Reset Form
                  </Button>
                </div>

                {currentStep < STEPS.length ? (
                  <Button
                    onClick={handleNext}
                    disabled={isSubmitting || !isStepValid()}
                    className="bg-apple-blue hover:bg-apple-blue/90 text-white flex items-center rounded-md"
                    aria-label="Next step"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-apple-green hover:bg-apple-green/90 text-white flex items-center rounded-md"
                    aria-label="Post task"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        Post Task
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}