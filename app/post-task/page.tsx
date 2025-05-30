"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/custom/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Upload, X, FileText, DollarSign, Calendar, Tag, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@civic/auth-web3/react"

const steps = [
  { id: 1, title: "Basic Info", icon: FileText },
  { id: 2, title: "Details", icon: Tag },
  { id: 3, title: "Budget & Timeline", icon: DollarSign },
  { id: 4, title: "Preview", icon: Eye },
]

const categories = [
  "Design",
  "Development",
  "Writing",
  "Marketing",
  "Video",
  "Audio",
  "Business",
  "Data",
  "Translation",
  "Other",
]

const skills = [
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "Ruby",
  "UI/UX Design",
  "Graphic Design",
  "Logo Design",
  "Web Design",
  "Mobile Design",
  "Content Writing",
  "Copywriting",
  "Technical Writing",
  "Blog Writing",
  "SEO",
  "Social Media",
  "Email Marketing",
  "PPC",
  "Content Marketing",
  "Video Editing",
  "Animation",
  "Motion Graphics",
  "3D Modeling",
  "Data Analysis",
  "Machine Learning",
  "Blockchain",
  "Smart Contracts",
]

export default function PostTaskPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading or redirecting...</p>
      </div>
    );
  }

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skills: [] as string[],
    budget: "",
    timeline: "",
    files: [] as File[],
  })
  const { toast } = useToast()

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }))
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = () => {
    toast({
      title: "Task Posted Successfully!",
      description: "Your task has been posted to the marketplace.",
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="title" className="text-base font-medium">
                Task Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Design a modern landing page for my SaaS product"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-2 h-12"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Write a clear, descriptive title that explains what you need
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your project in detail. Include requirements, expectations, and any specific instructions..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="mt-2 min-h-32"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Provide detailed information to help freelancers understand your needs
              </p>
            </div>

            <div>
              <Label className="text-base font-medium">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Select a category" />
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
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Label className="text-base font-medium">Required Skills</Label>
              <p className="text-sm text-muted-foreground mb-4">Select the skills needed for this task</p>
              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={formData.skills.includes(skill) ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      formData.skills.includes(skill)
                        ? "bg-apple-blue hover:bg-apple-blue/90"
                        : "hover:bg-apple-blue/10 hover:text-apple-blue hover:border-apple-blue"
                    }`}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              {formData.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} className="bg-apple-blue">
                        {skill}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleSkillToggle(skill)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label className="text-base font-medium">Attachments (Optional)</Label>
              <p className="text-sm text-muted-foreground mb-4">Upload any relevant files, documents, or references</p>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-apple-blue/50 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Click to upload files</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB each</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {formData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Uploaded Files:</p>
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="budget" className="text-base font-medium">
                Budget (XDC)
              </Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="1000"
                  value={formData.budget}
                  onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                  className="pl-10 h-12"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Set a fair budget based on the complexity of your task
              </p>
            </div>

            <div>
              <Label className="text-base font-medium">Timeline</Label>
              <Select
                value={formData.timeline}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, timeline: value }))}
              >
                <SelectTrigger className="mt-2 h-12">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
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
                  <span>Platform Fee (5%):</span>
                  <span className="font-medium">
                    {formData.budget ? (Number(formData.budget) * 0.05).toFixed(2) : "0"} XDC
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Cost:</span>
                  <span>{formData.budget ? (Number(formData.budget) * 1.05).toFixed(2) : "0"} XDC</span>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{formData.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <p className="font-medium">{formData.category}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Budget:</span>
                  <p className="font-medium text-apple-green">{formData.budget} XDC</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Timeline:</span>
                  <p className="font-medium">{formData.timeline}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Files:</span>
                  <p className="font-medium">{formData.files.length} attached</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm text-muted-foreground">Description:</span>
                <p className="mt-1">{formData.description}</p>
              </div>

              {formData.skills.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Required Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-apple-blue/10 border border-apple-blue/20 rounded-lg p-4">
              <h4 className="font-semibold text-apple-blue mb-2">Ready to Post?</h4>
              <p className="text-sm text-muted-foreground">
                Your task will be visible to thousands of qualified freelancers. You'll start receiving proposals within
                minutes of posting.
              </p>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  const CurrentStepIcon = steps[currentStep - 1].icon
  const currentStepTitle = steps[currentStep - 1].title

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
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep >= step.id
                      ? "bg-apple-blue border-apple-blue text-white"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  <CurrentStepIcon className="h-5 w-5" />
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
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-px mx-4 ${currentStep > step.id ? "bg-apple-blue" : "bg-muted-foreground/30"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-apple bg-card/50 backdrop-blur-sm">
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
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button onClick={handleNext} className="bg-apple-blue hover:bg-apple-blue/90 flex items-center">
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-apple-green hover:bg-apple-green/90 flex items-center">
                    Post Task
                    <ChevronRight className="ml-2 h-4 w-4" />
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
