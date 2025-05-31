import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { elizaAI } from '@/lib/eliza-ai';

// POST /api/ai-suggestions - Get AI suggestions for a task
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { taskId, taskData } = body;

    let task;
    
    if (taskId) {
      // Get suggestions for existing task
      task = await Task.findById(taskId);
      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
    } else if (taskData) {
      // Get suggestions for new task (preview mode)
      task = taskData;
    } else {
      return NextResponse.json(
        { error: 'Either taskId or taskData is required' },
        { status: 400 }
      );
    }

    // Get available freelancers
    const freelancers = await User.find({ 
      role: { $in: ['freelancer', 'both'] },
      isActive: true 
    }).limit(50);

    // Generate AI suggestions
    const suggestions = await elizaAI.suggestBestFit(task, freelancers);

    // If this is for an existing task, update it with suggestions
    if (taskId && suggestions.length > 0) {
      await Task.findByIdAndUpdate(taskId, {
        aiSuggestions: suggestions
      });
    }

    return NextResponse.json({
      suggestions,
      message: `Found ${suggestions.length} potential matches`
    });

  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}

// GET /api/ai-suggestions/analyze - Analyze task requirements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || '';
    const description = searchParams.get('description') || '';
    const category = searchParams.get('category') || '';
    const skills = searchParams.get('skills')?.split(',') || [];

    const taskData = {
      title,
      description,
      category,
      skills
    };

    const analysis = await elizaAI.analyzeTaskRequirements(taskData);

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error analyzing task requirements:', error);
    return NextResponse.json(
      { error: 'Failed to analyze task requirements' },
      { status: 500 }
    );
  }
} 