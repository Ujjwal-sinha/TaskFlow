import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Proposal } from '@/lib/models/Proposal'
import { ITask } from '@/lib/models/Task'
import mongoose from 'mongoose'

// POST /api/tasks/[id]/proposals/[proposalId]/select - Select a proposal and assign task
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; proposalId: string } }
) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { clientAddress } = body

    if (!clientAddress) {
      return NextResponse.json(
        { success: false, error: 'Client address is required' },
        { status: 400 }
      )
    }

    // Get the task
    const Task = mongoose.models.Task || mongoose.model<ITask>('Task', new mongoose.Schema({}))
    const task = await Task.findById(params.id)
    
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }

    // Verify the client owns this task
    if (task.client?.address !== clientAddress) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: You can only select proposals for your own tasks' },
        { status: 403 }
      )
    }

    // Check if task is still open
    if (task.status !== 'open') {
      return NextResponse.json(
        { success: false, error: 'Task is no longer accepting proposals' },
        { status: 400 }
      )
    }

    // Get the proposal
    const proposal = await Proposal.findById(params.proposalId)
    
    if (!proposal) {
      return NextResponse.json(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      )
    }

    // Verify the proposal belongs to this task
    if (proposal.taskId !== params.id) {
      return NextResponse.json(
        { success: false, error: 'Proposal does not belong to this task' },
        { status: 400 }
      )
    }

    // Update the selected proposal status
    await Proposal.findByIdAndUpdate(params.proposalId, {
      status: 'selected'
    })

    // Reject all other proposals for this task
    await Proposal.updateMany(
      { 
        taskId: params.id, 
        _id: { $ne: params.proposalId } 
      },
      { status: 'rejected' }
    )

    // Update task status and assign freelancer
    await Task.findByIdAndUpdate(params.id, {
      status: 'in_progress',
      freelancerAddress: proposal.proposerAddress,
      selectedProposal: params.proposalId
    })

    return NextResponse.json({
      success: true,
      message: 'Proposal selected successfully',
      selectedProposal: proposal
    })

  } catch (error) {
    console.error('Error selecting proposal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to select proposal' },
      { status: 500 }
    )
  }
} 