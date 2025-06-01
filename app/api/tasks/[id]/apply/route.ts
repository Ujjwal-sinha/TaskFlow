import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Task from '@/lib/models/Task'
import User from '@/lib/models/User'
import { elizaAI } from '@/lib/eliza-ai'
import { ethers } from 'ethers'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const taskId = params.id
    const body = await request.json()
    const { 
      proposal, 
      bidAmount, 
      freelancerAddress, 
      freelancerName, 
      freelancerAvatar,
      freelancerRating 
    } = body

    // Validate required fields
    if (!proposal || !freelancerAddress) {
      return NextResponse.json(
        { error: 'Proposal and freelancer address are required' },
        { status: 400 }
      )
    }

    if (!ethers.isAddress(freelancerAddress)) {
      return NextResponse.json(
        { error: 'Invalid freelancer address' },
        { status: 400 }
      )
    }

    // Find the task
    const task = await Task.findById(taskId)
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    if (task.status !== 'open') {
      return NextResponse.json(
        { error: 'Task is no longer accepting applications' },
        { status: 400 }
      )
    }

    // Check if user already applied
    const existingApplication = task.applicants?.find(
      (app: any) => app.walletAddress?.toLowerCase() === freelancerAddress.toLowerCase()
    )

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this task' },
        { status: 400 }
      )
    }

    // Get or create freelancer user profile
    let freelancer = await User.findOne({ 
      walletAddress: { $regex: new RegExp(`^${freelancerAddress}$`, 'i') }
    })

    if (!freelancer) {
      // Create basic profile for new wallet user
      freelancer = new User({
        name: freelancerName || `User ${freelancerAddress.substring(0, 6)}`,
        walletAddress: freelancerAddress,
        avatar: freelancerAvatar || '/placeholder-user.jpg',
        role: 'freelancer',
        skills: [],
        rating: freelancerRating || 4.0,
        totalJobs: 0,
        completedJobs: 0,
        isActive: true
      })
      await freelancer.save()
    }

    // Create application
    const application = {
      userId: freelancer._id.toString(),
      userName: freelancer.name,
      userAvatar: freelancer.avatar,
      userRating: freelancer.rating,
      appliedAt: new Date(),
      proposal: proposal.trim(),
      bidAmount: bidAmount ? parseFloat(bidAmount) : task.reward,
      walletAddress: freelancerAddress
    }

    // Add application to task
    if (!task.applicants) {
      task.applicants = []
    }
    task.applicants.push(application)

    // Get all applicants for AI analysis
    const allApplicantIds = task.applicants.map((app: any) => app.userId)
    const allApplicants = await User.find({
      _id: { $in: allApplicantIds }
    })

    // Generate AI suggestions
    try {
      const aiSuggestions = await elizaAI.suggestBestFit(task, allApplicants)
      task.aiSuggestions = aiSuggestions
    } catch (aiError) {
      console.error('AI analysis error:', aiError)
      // Continue without AI suggestions
    }

    await task.save()

    // Find AI suggestion for this applicant
    const applicantSuggestion = task.aiSuggestions?.find(
      (suggestion: any) => suggestion.userId === freelancer._id.toString()
    )

    return NextResponse.json({
      message: 'Application submitted successfully',
      application: {
        ...application,
        aiAnalysis: applicantSuggestion || {
          matchScore: 0,
          reason: 'Analysis pending'
        }
      },
      taskId: task._id.toString()
    })

  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
} 