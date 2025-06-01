import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, X } from 'lucide-react'
import { PostTaskProps } from './types'
import { SKILLS, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './constants'
import { useToast } from '@/hooks/use-toast'

interface Step2Props extends PostTaskProps {}

export const Step2Details: React.FC<Step2Props> = ({ 
  formData, 
  setFormData 
}) => {
  const [searchSkills, setSearchSkills] = useState("")
  const { toast } = useToast()

  // Filter skills based on search
  const filteredSkills = SKILLS.filter(skill => 
    skill.toLowerCase().includes(searchSkills.toLowerCase())
  )

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter((s) => s !== skill) 
        : [...prev.skills, skill],
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => {
      const isValidType = ALLOWED_FILE_TYPES.includes(file.type)
      const isValidSize = file.size <= MAX_FILE_SIZE
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type (PDF, JPEG, PNG only).`,
          variant: "destructive",
        })
        return false
      }
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 5MB limit.`,
          variant: "destructive",
        })
        return false
      }
      return true
    })
    
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...validFiles],
    }))
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-base font-medium">Required Skills</Label>
        <div className="mt-2">
          <Input
            type="text"
            placeholder="Search skills..."
            value={searchSkills}
            onChange={(e) => setSearchSkills(e.target.value)}
            className="mb-4 rounded-md"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {filteredSkills.map((skill) => (
            <Badge
              key={skill}
              variant={formData.skills.includes(skill) ? "default" : "outline"}
              className={`cursor-pointer transition-all hover:scale-105 justify-center py-2 rounded-md ${
                formData.skills.includes(skill)
                  ? "bg-apple-blue hover:bg-apple-blue/90 text-white"
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
                <Badge key={skill} variant="default" className="bg-apple-blue text-white rounded-md">
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
            <Button variant="secondary" size="sm" asChild>
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
  )
} 