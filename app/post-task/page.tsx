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
import { ChevronLeft, ChevronRight, Upload, X, FileText, DollarSign, Calendar, Tag, Eye, Loader2, Sparkles } from "lucide-react"
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
  "Blockchain",
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

interface FormData {
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: string;
  timeline: string;
  files: File[];
}

interface AISuggestions {
  suggestions?: string[];
  estimatedBudget?: { min: string; max: string };
  estimatedDuration?: string;
}

export default function PostTaskPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    skills: [],
    budget: "",
    timeline: "",
    files: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [platformFee, setPlatformFee] = useState(0.05); // Default 5%

  const progress = (currentStep / steps.length) * 100;

  // Validate current step for enabling/disabling Next button
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.description.trim() && formData.category;
      case 2:
        return true; // Skills and files are optional
      case 3:
        return formData.budget && Number(formData.budget) > 0 && formData.timeline;
      default:
        return true;
    }
  };

  // Get AI suggestions for task requirements
  const getAISuggestions = async () => {
    if (!formData.title || !formData.description || !formData.category) return;

    try {
      setLoadingAI(true);
      const params = new URLSearchParams({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills: formData.skills.join(','),
      });

      const response = await fetch(`/api/ai-suggestions/analyze?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch AI suggestions');
      }
      const suggestions = await response.json();
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast({
        title: "AI Suggestions Error",
        description: "Failed to load AI suggestions. Please proceed without them.",
        variant: "destructive",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  // Trigger AI suggestions when on step 3 or when relevant fields change
  useEffect(() => {
    if (currentStep === 3 && formData.title && formData.description && formData.category) {
      getAISuggestions();
    }
  }, [currentStep, formData.title, formData.description, formData.category, formData.skills]);

  // Fetch platform fee (mocked here; replace with actual API call if available)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Example: const response = await fetch('/api/config');
        // const data = await response.json();
        // setPlatformFee(data.platformFee);
        setPlatformFee(0.05); // Mocked for now
      } catch (error) {
        console.error('Error fetching platform fee:', error);
      }
    };
    fetchConfig();
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length && isStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type (PDF, JPEG, PNG only).`,
          variant: "destructive",
        });
        return false;
      }
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 5MB limit.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...validFiles],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      skills: [],
      budget: "",
      timeline: "",
      files: [],
    });
    setCurrentStep(1);
    setAiSuggestions(null);
    toast({
      title: "Form Reset",
      description: "The form has been reset.",
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.budget || !formData.timeline) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      if (Number(formData.budget) <= 0) {
        toast({
          title: "Invalid Budget",
          description: "Budget must be a positive number.",
          variant: "destructive",
        });
        return;
      }

      // Prepare task data
      const taskData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills: formData.skills,
        budget: formData.budget,
        timeline: formData.timeline,
        clientId: user.id || user.walletAddress,
        clientName: user.name || user.displayName || 'Anonymous User',
        clientAvatar: user.avatar || '/placeholder-user.jpg',
        clientRating: 0, // New users start with 0 rating
      };

      // Submit task to API
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }

      toast({
        title: "Task Posted Successfully!",
        description: "Your task has been posted to the marketplace.",
      });

      // Redirect to marketplace
      router.push('/marketplace');
    } catch (error) {
      console.error('Error submitting task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Task Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Design a modern landing page for my SaaS product"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value.trim() }))}
                className="mt-2 h-12"
                required
                aria-required="true"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Write a clear, descriptive title that explains what you need
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your project in detail. Include requirements, expectations, and any specific instructions..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value.trim() }))}
                className="mt-2 min-h-32"
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
                <SelectTrigger className="mt-2 h-12" aria-label="Select a category">
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
        );

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
              <p className="text-sm text-muted-foreground mb-4">
                Select the skills needed for this task
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={formData.skills.includes(skill) ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 justify-center py-2 ${
                      formData.skills.includes(skill)
                        ? "bg-apple-blue hover:bg-apple-blue/90"
                        : "hover:bg-apple-blue/10 hover:text-apple-blue hover:border-apple-blue"
                    }`}
                    onClick={() => handleSkillToggle(skill)}
                    role="button"
                    aria-pressed={formData.skills.includes(skill)}
                    aria-label={`Toggle ${skill} skill`}
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
                      <Badge key={skill} variant="default" className="bg-apple-blue">
                        {skill}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => handleSkillToggle(skill)}
                          aria-label={`Remove ${skill} skill`}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label className="text-base font-medium">Attachments (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload files to help explain your project (PDF, JPEG, PNG; max 5MB)
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  aria-label="Upload files"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose Files</span>
                  </Button>
                </Label>
              </div>

              {formData.files.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 3:
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
                        <ul className="text-sm text-purple-700 space-y-1">
                          {aiSuggestions.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
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
                className="mt-2 h-12"
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
                <SelectTrigger className="mt-2 h-12" aria-label="Select timeline">
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
          </motion.div>
        );

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
                minutes of posting. Our AI will also suggest the best-fit freelancers for your project.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const CurrentStepIcon = steps[currentStep - 1].icon;
  const currentStepTitle = steps[currentStep - 1].title;

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
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || isSubmitting}
                    className="flex items-center"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="text-muted-foreground"
                    aria-label="Reset form"
                  >
                    Reset Form
                  </Button>
                </div>

                {currentStep < steps.length ? (
                  <Button
                    onClick={handleNext}
                    disabled={isSubmitting || !isStepValid()}
                    className="bg-apple-blue hover:bg-apple-blue/90 flex items-center"
                    aria-label="Next step"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-apple-green hover:bg-apple-green/90 flex items-center"
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
  );
}