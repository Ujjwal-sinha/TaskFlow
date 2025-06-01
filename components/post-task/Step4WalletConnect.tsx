import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Wallet } from 'lucide-react'
import { PostTaskProps } from './types'
import { useTaskEscrow } from '@/hooks/useTaskEscrow'
import { usePostTaskValidation } from '@/hooks/usePostTaskValidation'

interface Step4Props extends PostTaskProps {}

export const Step4WalletConnect: React.FC<Step4Props> = ({ 
  formData, 
  currentStep 
}) => {
  const {
    isConnected,
    isLoading: web3Loading,
    error: web3Error,
    currentAccount,
    connect,
  } = useTaskEscrow(process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS)

  const { validateStep } = usePostTaskValidation()
  const validation = validateStep(currentStep, formData, isConnected, currentAccount)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Wallet Connection */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Wallet className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-blue-800">Connect Wallet for Escrow</h3>
        </div>
        
        {!isConnected ? (
          <div className="space-y-4">
            <p className="text-sm text-blue-700">
              Connect your MetaMask wallet to create tasks with smart contract escrow on XDC blockchain. 
              Your tokens will be safely locked until a freelancer completes the task.
            </p>
            <Button 
              onClick={connect} 
              disabled={web3Loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {web3Loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect MetaMask Wallet
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Wallet Connected</span>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {currentAccount?.substring(0, 6)}...{currentAccount?.slice(-4)}
              </Badge>
            </div>
            <Badge variant="secondary" className="text-xs">XDC Apothem Testnet</Badge>
            <p className="text-sm text-green-700">
              ✅ Ready to create task with blockchain escrow
            </p>
          </div>
        )}
        
        {web3Error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">{web3Error}</p>
          </div>
        )}
      </div>

      {/* Smart Contract Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">🔒 Smart Contract Escrow</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Your XDC tokens will be locked in a smart contract escrow</li>
          <li>• Freelancers can apply for your task through the marketplace</li>
          <li>• You select the best freelancer from applicants</li>
          <li>• Funds are automatically released when task is marked complete</li>
          <li>• You can cancel and get a refund if needed</li>
          <li>• Transparent and secure on the XDC blockchain</li>
        </ul>
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