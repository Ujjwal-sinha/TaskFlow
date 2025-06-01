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

    const walletAddress = params.address

    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Valid wallet address is required' },
        { status: 400 }
      )
    }

    // Find all tasks where this user has applied
    const tasksWithApplications = await Task.find({
      'applicants.walletAddress': { $regex: new RegExp(`^${walletAddress}$`, 'i') }
    }).lean()

    // Extract user's applications from each task
    const userApplications = []

    for (const task of tasksWithApplications) {
      const userApplication = task.applicants?.find(
        (app: any) => app.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
      )

      if (userApplication) {
        // Find AI analysis for this user
        const aiAnalysis = task.aiSuggestions?.find(
          (suggestion: any) => suggestion.userId === userApplication.userId
        )

        userApplications.push({
          _id: userApplication._id || `${task._id}_${userApplication.userId}`,
          taskId: task._id.toString(),
          taskTitle: task.title,
          taskReward: task.reward,
          taskCurrency: task.currency,
          taskCategory: task.category,
          taskStatus: task.status,
          clientName: task.client.name,
          clientAvatar: task.client.avatar,
          clientRating: task.client.rating,
          proposal: userApplication.proposal,
          bidAmount: userApplication.bidAmount,
          appliedAt: userApplication.appliedAt,
          status: determineApplicationStatus(task.status, userApplication),
          aiAnalysis: aiAnalysis ? {
            matchScore: aiAnalysis.matchScore,
            reason: aiAnalysis.reason
          } : null
        })
      }
    }

    // Sort by application date (newest first)
    userApplications.sort((a, b) => 
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    )

    // Calculate stats
    const stats = {
      totalApplications: userApplications.length,
      activeApplications: userApplications.filter(app => 
        app.status === 'pending' || app.status === 'under_review'
      ).length,
      averageMatchScore: userApplications.length > 0 
        ? Math.round(
            userApplications
              .filter(app => app.aiAnalysis?.matchScore)
              .reduce((sum, app) => sum + (app.aiAnalysis?.matchScore || 0), 0) /
            userApplications.filter(app => app.aiAnalysis?.matchScore).length
          )
        : 0,
      totalEarnings: userApplications
        .filter(app => app.status === 'completed')
        .reduce((sum, app) => sum + app.bidAmount, 0)
    }

    return NextResponse.json({
      applications: userApplications,
      stats,
      total: userApplications.length
    })

  } catch (error) {
    console.error('Error fetching user applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// Helper function to determine application status
function determineApplicationStatus(taskStatus: string, application: any) {
  switch (taskStatus) {
    case 'open':
      return 'pending'
    case 'in-progress':
      // Check if this user was selected (you'd need additional logic here)
      return 'under_review'
    case 'completed':
      return 'completed'
    case 'cancelled':
      return 'cancelled'
    default:
      return 'pending'
  }
} 