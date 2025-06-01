import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { PostTaskProps } from './types'
import { useTaskEscrow } from '@/hooks/useTaskEscrow'

interface Step5Props extends PostTaskProps {}

export const Step5Preview: React.FC<Step5Props> = ({ formData }) => {
  const { currentAccount } = useTaskEscrow(process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS)

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
            <span className="text-sm text-muted-foreground">Attachments:</span>
            <p className="font-medium">{formData.files.length} files</p>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-sm text-muted-foreground">Description:</span>
          <p className="mt-1">{formData.description}</p>
        </div>

        {formData.skills.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-muted-foreground">Required Skills:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="rounded-md">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Web3 Details */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Your Wallet:</span>
              <p className="font-mono text-sm">{currentAccount?.substring(0, 6)}...{currentAccount?.slice(-4)}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant="outline" className="text-green-700 border-green-300">Open for Applications</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-apple-blue/10 border border-apple-blue/20 rounded-lg p-4">
        <h4 className="font-semibold text-apple-blue mb-2">Ready to Deploy on Blockchain? 🚀</h4>
        <p className="text-sm text-muted-foreground">
          Your task will be created with smart contract escrow on XDC blockchain. Freelancers can apply, 
          and you'll select the best one. Payment will be released automatically upon completion.
        </p>
      </div>
    </motion.div>
  )
} 