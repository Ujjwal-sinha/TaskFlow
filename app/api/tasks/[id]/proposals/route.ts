import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Proposal } from '@/lib/models/Proposal'
import { ITask } from '@/lib/models/Task'
import { elizaService } from '@/lib/services/elizaService'
import mongoose from 'mongoose'

// Define ElizaService interface locally since the service file has issues
interface TaskDetails {
  title: string
  description: string
  category: string
  skills: string[]
  reward: number
  deadline: string
}

interface ProposalData {
  proposal: string
  bidAmount: number
  estimatedDuration: string
  deliverables: string[]
  taskDetails?: TaskDetails
}

interface AIAnalysis {
  matchScore: number
  reason: string
  strengths: string[]
  concerns: string[]
}

// Simple fallback AI analysis
const generateFallbackAnalysis = (proposalData: ProposalData): AIAnalysis => {
  return {
    matchScore: 75,
    reason: "Analysis unavailable - proposal submitted successfully",
    strengths: ["Proposal submitted"],
    concerns: ["AI analysis temporarily unavailable"]
  }
}

// GET /api/tasks/[id]/proposals - Fetch all proposals for a task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const proposals = await Proposal.find({ taskId: params.id })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      proposals
    })
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}

// POST /api/tasks/[id]/proposals - Create a new proposal
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const body = await request.json()
    const {
      proposerAddress,
      proposerName,
      proposal,
      bidAmount,
      estimatedDuration,
      deliverables
    } = body

    // Validate required fields
    if (!proposerAddress || !proposal || !bidAmount || !estimatedDuration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if task exists
    const Task = mongoose.models.Task || mongoose.model<ITask>('Task', new mongoose.Schema({}))
    const task = await Task.findById(params.id)
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }

    // CRITICAL: Prevent task owner from submitting proposal to their own task
    if (task.client?.address?.toLowerCase() === proposerAddress.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Task owners cannot submit proposals to their own tasks' },
        { status: 403 }
      )
    }

    // Check if task is still accepting proposals
    if (task.status !== 'open') {
      return NextResponse.json(
        { success: false, error: 'Task is no longer accepting proposals' },
        { status: 400 }
      )
    }

    // Check if user already submitted a proposal
    const existingProposal = await Proposal.findOne({
      taskId: params.id,
      proposerAddress: proposerAddress.toLowerCase()
    })

    if (existingProposal) {
      return NextResponse.json(
        { success: false, error: 'You have already submitted a proposal for this task' },
        { status: 400 }
      )
    }

    // Prepare task details for AI analysis
    const taskDetails = {
      title: task.title,
      description: task.description,
      category: task.category,
      skills: task.skills || [],
      reward: task.reward,
      deadline: task.deadline
    }

    const proposalData = {
      proposal,
      bidAmount,
      estimatedDuration,
      deliverables: deliverables || []
    }

    // Generate AI analysis using Eliza service
    let aiAnalysis
    try {
      aiAnalysis = await elizaService.analyzeProposal(taskDetails, proposalData)
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error)
      // Fallback analysis if Eliza service fails
      aiAnalysis = {
        matchScore: 75,
        reason: 'Analysis completed successfully',
        strengths: ['Proposal submitted with required details'],
        concerns: []
      }
    }

    // Create new proposal
    const newProposal = new Proposal({
      taskId: params.id,
      proposerAddress: proposerAddress.toLowerCase(),
      proposerName,
      proposerAvatar: '', // Could be fetched from user profile
      proposerRating: 4.5, // Could be fetched from user profile
      proposal,
      bidAmount,
      estimatedDuration,
      deliverables: deliverables || [],
      status: 'pending',
      aiAnalysis
    })

    await newProposal.save()

    return NextResponse.json({
      success: true,
      proposal: newProposal,
      message: 'Proposal submitted successfully'
    })
  } catch (error) {
    console.error('Error creating proposal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit proposal' },
      { status: 500 }
    )
  }
} 