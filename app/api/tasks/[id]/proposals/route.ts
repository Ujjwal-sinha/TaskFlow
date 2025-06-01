import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Proposal } from '@/lib/models/Proposal'
import { elizaService } from '@/lib/services/elizaService'

// GET /api/tasks/[id]/proposals - Fetch all proposals for a task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Build query
    const query: any = { taskId: id }
    if (status) {
      query.status = status
    }

    // Fetch proposals with sorting by creation date
    const proposals = await Proposal.find(query)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      proposals: proposals.map((proposal: any) => ({
        ...proposal,
        _id: proposal._id?.toString() || proposal._id
      }))
    })

  } catch (error: unknown) {
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
    
    const { id } = params
    const body = await request.json()
    
    const {
      proposerAddress,
      proposerName,
      proposerAvatar,
      proposerRating,
      proposal,
      bidAmount,
      estimatedDuration,
      deliverables,
      taskDetails // Task details for AI analysis
    } = body

    // Validation
    if (!proposerAddress || !proposerName || !proposal || !bidAmount || !estimatedDuration) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already has a proposal for this task
    const existingProposal = await Proposal.findOne({
      taskId: id,
      proposerAddress: proposerAddress.toLowerCase()
    })

    if (existingProposal) {
      return NextResponse.json(
        { success: false, error: 'You have already submitted a proposal for this task' },
        { status: 409 }
      )
    }

    // Perform AI analysis of the proposal
    let aiAnalysis = null
    if (taskDetails) {
      try {
        aiAnalysis = await elizaService.analyzeProposal(taskDetails, {
          proposal,
          bidAmount,
          estimatedDuration,
          deliverables: Array.isArray(deliverables) ? deliverables : []
        })
      } catch (error) {
        console.warn('AI analysis failed, proceeding without it:', error)
      }
    }

    // Create new proposal
    const newProposal = new Proposal({
      taskId: id,
      proposerAddress: proposerAddress.toLowerCase(),
      proposerName,
      proposerAvatar: proposerAvatar || '',
      proposerRating: proposerRating || 0,
      proposal,
      bidAmount,
      estimatedDuration,
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      aiAnalysis,
      status: 'pending'
    })

    await newProposal.save()

    return NextResponse.json({
      success: true,
      proposal: {
        ...newProposal.toObject(),
        _id: newProposal._id.toString()
      },
      message: 'Proposal submitted successfully!'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating proposal:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'You have already submitted a proposal for this task' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to submit proposal' },
      { status: 500 }
    )
  }
} 