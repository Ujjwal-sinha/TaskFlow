import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ITask } from '@/lib/models/Task'
import { Proposal } from '@/lib/models/Proposal'
import mongoose from 'mongoose'

// POST /api/tasks/[id]/complete - Mark task as complete
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { 
      clientAddress, 
      transactionHash, 
      blockchainCompleted = false,
      rating,
      feedback 
    } = body

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
    if (task.client?.address?.toLowerCase() !== clientAddress.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only task owner can mark task as complete' },
        { status: 403 }
      )
    }

    // Check if task is in progress
    if (task.status !== 'in_progress') {
      return NextResponse.json(
        { success: false, error: 'Task must be in progress to be completed' },
        { status: 400 }
      )
    }

    // Update task status
    const updateData: any = {
      status: 'completed',
      completedAt: new Date(),
      updatedAt: new Date()
    }

    // Add blockchain transaction details if provided
    if (transactionHash) {
      updateData.transactionHash = transactionHash
      updateData.blockchainCompleted = blockchainCompleted
    }

    // Add rating and feedback if provided
    if (rating !== undefined) {
      updateData.rating = rating
    }
    if (feedback) {
      updateData.feedback = feedback
    }

    await Task.findByIdAndUpdate(params.id, updateData)

    // Update the selected proposal status
    if (task.selectedProposal) {
      await Proposal.findByIdAndUpdate(task.selectedProposal, {
        status: 'completed',
        completedAt: new Date()
      })
    }

    // Get updated task
    const updatedTask = await Task.findById(params.id)

    return NextResponse.json({
      success: true,
      message: 'Task marked as completed successfully',
      task: updatedTask
    })

  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to complete task' },
      { status: 500 }
    )
  }
} 