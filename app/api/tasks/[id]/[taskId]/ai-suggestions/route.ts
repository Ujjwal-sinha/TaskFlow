import { NextRequest, NextResponse } from 'next/server'
import { elizaService } from '@/lib/services/elizaService'

// GET /api/tasks/[taskId]/ai-suggestions - Generate AI proposal suggestions
export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const count = parseInt(searchParams.get('count') || '3')
    
    // Get task details from query parameters
    const title = searchParams.get('title')
    const description = searchParams.get('description')
    const category = searchParams.get('category')
    const skills = searchParams.get('skills')
    const reward = searchParams.get('reward')
    const deadline = searchParams.get('deadline')

    // Validate required parameters
    if (!title || !description || !category || !reward) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required task details (title, description, category, reward)' 
        },
        { status: 400 }
      )
    }

    // Prepare task details for AI analysis
    const taskDetails = {
      title,
      description,
      category,
      skills: skills ? skills.split(',').map(s => s.trim()) : [],
      reward: parseFloat(reward),
      deadline: deadline || 'Not specified'
    }

    // Generate AI suggestions
    const suggestions = await elizaService.generateSuggestions(taskDetails, count)

    return NextResponse.json({
      success: true,
      suggestions,
      taskId: params.taskId,
      metadata: {
        generatedAt: new Date().toISOString(),
        basedOnTask: {
          title: taskDetails.title,
          category: taskDetails.category,
          reward: taskDetails.reward
        }
      }
    })

  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate AI suggestions',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/tasks/[taskId]/ai-suggestions - Generate suggestions with detailed task data
export async function POST(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const body = await request.json()
    const { taskDetails, options = {} } = body

    // Validate task details
    if (!taskDetails || !taskDetails.title || !taskDetails.description) {
      return NextResponse.json(
        { success: false, error: 'Invalid task details provided' },
        { status: 400 }
      )
    }

    const count = options.count || 3
    const creativity = options.creativity || 0.7

    // Ensure required fields have defaults
    const enrichedTaskDetails = {
      title: taskDetails.title,
      description: taskDetails.description,
      category: taskDetails.category || 'General',
      skills: Array.isArray(taskDetails.skills) ? taskDetails.skills : [],
      reward: taskDetails.reward || 0,
      deadline: taskDetails.deadline || 'Flexible'
    }

    // Generate AI suggestions with enhanced context
    const suggestions = await elizaService.generateSuggestions(enrichedTaskDetails, count)

    // Add additional metadata to suggestions
    const enhancedSuggestions = suggestions.map((suggestion, index) => ({
      ...suggestion,
      id: `ai-suggestion-${index + 1}`,
      type: 'ai-generated',
      metadata: {
        approach: index === 0 ? 'conservative' : index === 1 ? 'innovative' : 'value',
        generatedAt: new Date().toISOString()
      }
    }))

    return NextResponse.json({
      success: true,
      suggestions: enhancedSuggestions,
      taskId: params.taskId,
      aiMetadata: {
        model: 'eliza-os',
        generatedAt: new Date().toISOString(),
        taskCategory: enrichedTaskDetails.category,
        creativity: creativity,
        totalSuggestions: enhancedSuggestions.length
      }
    })

  } catch (error) {
    console.error('Error generating AI suggestions (POST):', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate AI suggestions',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
} 