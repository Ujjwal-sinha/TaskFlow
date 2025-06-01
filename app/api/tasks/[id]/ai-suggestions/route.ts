import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ITask } from '@/lib/models/Task'
import { elizaService } from '@/lib/services/elizaService'
import mongoose from 'mongoose'

interface AISuggestion {
  id: string
  proposal: string
  bidAmount: number
  estimatedDuration: string
  deliverables: string[]
  reasoning: string
  confidence: number
  type: string
  metadata?: {
    approach: string
  }
}

// Generate fallback AI suggestions
const generateFallbackSuggestions = (task: any): AISuggestion[] => {
  const baseAmount = task.reward || 1000
  
  return [
    {
      id: '1',
      type: 'conservative',
      proposal: `I would approach this ${task.category?.toLowerCase() || 'project'} with a proven methodology focusing on ${task.title}. With extensive experience in similar projects, I'll deliver high-quality results within your timeline. My approach emphasizes clear communication, regular updates, and thorough testing to ensure your complete satisfaction.`,
      bidAmount: Math.round(baseAmount * 0.85),
      estimatedDuration: '2-3 weeks',
      deliverables: [
        'Complete project files',
        'Source code/design files',
        'Documentation',
        'Testing and quality assurance',
        'Post-delivery support'
      ],
      reasoning: 'Conservative approach with proven methods and competitive pricing',
      confidence: 90,
      metadata: {
        approach: 'Established methodology with focus on reliability'
      }
    },
    {
      id: '2',
      type: 'innovative',
      proposal: `I'm excited to bring cutting-edge solutions to your ${task.title} project. Using the latest tools and innovative approaches in ${task.category?.toLowerCase() || 'this field'}, I'll deliver not just what you need, but exceed your expectations with modern, scalable solutions that future-proof your investment.`,
      bidAmount: Math.round(baseAmount * 0.95),
      estimatedDuration: '3-4 weeks',
      deliverables: [
        'Modern, scalable solution',
        'Advanced features implementation',
        'Performance optimization',
        'Comprehensive documentation',
        'Training and knowledge transfer'
      ],
      reasoning: 'Innovative approach with latest technologies and enhanced features',
      confidence: 85,
      metadata: {
        approach: 'Cutting-edge technology with enhanced capabilities'
      }
    },
    {
      id: '3',
      type: 'value',
      proposal: `I offer exceptional value for your ${task.title} project by combining efficiency with quality. My streamlined process and extensive template library allow me to deliver professional results quickly while maintaining high standards. Perfect for getting maximum impact within your budget.`,
      bidAmount: Math.round(baseAmount * 0.75),
      estimatedDuration: '1-2 weeks',
      deliverables: [
        'Core functionality implementation',
        'Essential documentation',
        'Basic testing',
        'Deployment assistance',
        'Limited revisions'
      ],
      reasoning: 'Value-focused approach maximizing output within budget constraints',
      confidence: 88,
      metadata: {
        approach: 'Efficient delivery with cost optimization'
      }
    }
  ]
}

// GET /api/tasks/[id]/ai-suggestions - Generate AI proposal suggestions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    // Get task from database
    const Task = mongoose.models.Task || mongoose.model<ITask>('Task', new mongoose.Schema({}))
    const task = await Task.findById(params.id)
    
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }
    
    const taskDetails = {
      title: task.title,
      description: task.description,
      category: task.category,
      skills: task.skills || [],
      reward: task.reward,
      deadline: task.deadline
    }

    // Generate AI suggestions using Eliza service
    let suggestions
    try {
      suggestions = await elizaService.generateSuggestions(taskDetails, 3)
    } catch (error) {
      console.error('Eliza AI suggestions failed, using fallback:', error)
      // Return simple fallback suggestions
      suggestions = [
        {
          proposal: `Professional approach to ${task.title} with focus on quality delivery within timeline.`,
          bidAmount: Math.round(task.reward * 0.9),
          estimatedDuration: '2-3 weeks',
          deliverables: ['Complete implementation', 'Documentation', 'Testing'],
          reasoning: 'Balanced approach focusing on quality and efficiency',
          confidence: 85
        }
      ]
    }

    return NextResponse.json({
      success: true,
      suggestions,
      message: 'AI suggestions retrieved successfully'
    })

  } catch (error) {
    console.error('Error retrieving AI suggestions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve AI suggestions' },
      { status: 500 }
    )
  }
}

// POST /api/tasks/[id]/ai-suggestions - Generate suggestions with detailed task data
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { taskDetails, count = 3 } = body

    // Get task from database if taskDetails not provided
    let task = taskDetails
    if (!task) {
      const Task = mongoose.models.Task || mongoose.model<ITask>('Task', new mongoose.Schema({}))
      const dbTask = await Task.findById(params.id)
      
      if (!dbTask) {
        return NextResponse.json(
          { success: false, error: 'Task not found' },
          { status: 404 }
        )
      }
      
      task = {
        title: dbTask.title,
        description: dbTask.description,
        category: dbTask.category,
        skills: dbTask.skills || [],
        reward: dbTask.reward,
        deadline: dbTask.deadline
      }
    }

    // Generate AI suggestions using Eliza service
    let suggestions
    try {
      suggestions = await elizaService.generateSuggestions(task, count)
    } catch (error) {
      console.error('Eliza AI suggestions failed, using fallback:', error)
      // Return simple fallback suggestions
      suggestions = [
        {
          proposal: `Professional approach to ${task.title} with focus on quality delivery within timeline.`,
          bidAmount: Math.round(task.reward * 0.9),
          estimatedDuration: '2-3 weeks',
          deliverables: ['Complete implementation', 'Documentation', 'Testing'],
          reasoning: 'Balanced approach focusing on quality and efficiency',
          confidence: 85
        }
      ]
    }

    return NextResponse.json({
      success: true,
      suggestions,
      message: 'AI suggestions generated successfully'
    })

  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI suggestions' },
      { status: 500 }
    )
  }
} 