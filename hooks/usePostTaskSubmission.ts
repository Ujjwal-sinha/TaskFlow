import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import { useToast } from '@/hooks/use-toast'
import { FormData } from '@/components/post-task/types'
import { usePostTaskValidation } from './usePostTaskValidation'

export const usePostTaskSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { validateFormData } = usePostTaskValidation()

  const submitTask = async (
    formData: FormData,
    isConnected: boolean,
    currentAccount: string | null,
    user: any
  ) => {
    try {
      setIsSubmitting(true)

      // Validate form data
      const validation = validateFormData(formData)
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: validation.message,
          variant: "destructive",
        })
        return
      }

      // Validate Web3 requirements
      if (!isConnected || !currentAccount) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to proceed.",
          variant: "destructive",
        })
        return
      }

      // Check if contract address is configured
      if (!process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS) {
        toast({
          title: "Contract Not Configured",
          description: "Smart contract address not found. Please contact support.",
          variant: "destructive",
        })
        return
      }

      // Create contract instance using MetaMask provider
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Updated ABI to match your actual smart contract
      const contractABI = [
        "function postTask(string memory _title, string memory _description) payable returns (uint256)",
        "function assignTask(uint256 _taskId, address _freelancer)",
        "function completeTask(uint256 _taskId)",
        "function cancelTask(uint256 _taskId)",
        "function getTask(uint256 _taskId) view returns (uint256, address, address, uint256, uint8, uint256, uint256, uint256, string, string)"
      ]
      
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS,
        contractABI,
        signer
      )

      // Convert budget to Wei (XDC)
      const rewardWei = ethers.parseEther(formData.budget)

      toast({
        title: "Transaction Starting",
        description: "Please confirm the transaction in MetaMask...",
      })

      // Call contract function with title and description
      const tx = await contract.postTask(formData.title, formData.description, { value: rewardWei })
      
      toast({
        title: "Transaction Submitted",
        description: "Waiting for blockchain confirmation...",
      })

      const receipt = await tx.wait()
      let contractTaskId = null

      // Extract task ID from events
      const taskPostedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log)
          return parsed?.name === 'TaskPosted'
        } catch {
          return false
        }
      })

      if (taskPostedEvent) {
        const parsedEvent = contract.interface.parseLog(taskPostedEvent)
        contractTaskId = Number(parsedEvent?.args[0])
      }

      // Create task in database
      const taskData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills: formData.skills,
        budget: formData.budget,
        timeline: formData.timeline,
        clientId: user?.id || currentAccount,
        clientName: user?.name || user?.displayName || 'Wallet User',
        clientAvatar: user?.avatar || '/placeholder-user.jpg',
        clientRating: user?.rating || 0,
        contractTaskId,
        txHash: tx.hash,
        clientAddress: currentAccount,
      }

      // Save to database
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save task to database')
      }

      toast({
        title: "Task Posted Successfully! 🎉",
        description: `Task created with contract ID: ${contractTaskId}`,
      })

      // Redirect to marketplace
      router.push('/marketplace')

    } catch (error: any) {
      console.error('Error submitting task:', error)
      
      let errorMessage = "Failed to post task. Please try again."
      
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = "Transaction was cancelled by user."
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = "Insufficient XDC balance for this transaction."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitTask,
    isSubmitting
  }
} 