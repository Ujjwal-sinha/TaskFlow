import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Task from '@/lib/models/Task'
import { ethers } from 'ethers'

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    await connectDB()

    const clientAddress = params.address

    if (!clientAddress || !ethers.isAddress(clientAddress)) {
      return NextResponse.json(
        { error: 'Valid wallet address is required' },
        { status: 400 }
      )
    }

    // Find all tasks created by this client
    const clientTasks = await Task.find({
      $or: [
        { 'client.id': { $regex: new RegExp(`^${clientAddress}$`, 'i') } },
        { 'client.address': { $regex: new RegExp(`^${clientAddress}$`, 'i') } }
      ]
    }).sort({ createdAt: -1 }).lean()

    // Transform tasks to include applicant count and detailed applicant info
    const transformedTasks = clientTasks.map(task => ({
      ...task,
      _id: task._id.toString(),
      applicantCount: task.applicants?.length || 0,
      applicants: task.applicants?.map(applicant => ({
        ...applicant,
        _id: applicant._id?.toString(),
        appliedAt: applicant.appliedAt
      })) || []
    }))

    // Calculate summary statistics
    const stats = {
      totalTasks: transformedTasks.length,
      openTasks: transformedTasks.filter(task => task.status === 'open').length,
      inProgressTasks: transformedTasks.filter(task => task.status === 'in-progress').length,
      completedTasks: transformedTasks.filter(task => task.status === 'completed').length,
      totalApplicants: transformedTasks.reduce((sum, task) => sum + task.applicantCount, 0),
      totalRewardPosted: transformedTasks.reduce((sum, task) => sum + task.reward, 0)
    }

    return NextResponse.json({
      tasks: transformedTasks,
      stats
    })

  } catch (error) {
    console.error('Error fetching client tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
} 