import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { elizaAI } from '@/lib/eliza-ai';

// GET /api/tasks - Fetch all tasks with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build query
    let query: any = { status: 'open' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'highest-reward':
        sort = { reward: -1 };
        break;
      case 'lowest-reward':
        sort = { reward: 1 };
        break;
      case 'most-applicants':
        sort = { 'applicants': -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Task.countDocuments(query);

    // Transform tasks to include applicant count
    const transformedTasks = tasks.map(task => ({
      ...task,
      applicants: task.applicants?.length || 0,
      _id: task._id?.toString() || ''
    }));

    return NextResponse.json({
      tasks: transformedTasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      title,
      description,
      category,
      skills,
      budget,
      timeline,
      clientId,
      clientName,
      clientAvatar,
      clientRating
    } = body;

    // Validate required fields
    if (!title || !description || !category || !budget || !timeline || !clientId || !clientName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate deadline from timeline
    const deadline = new Date();
    
    // Handle different timeline formats from the frontend
    let daysToAdd = 7; // Default to 1 week
    
    switch (timeline) {
      case '1-3-days':
        daysToAdd = 3; // Use maximum of range for deadline
        break;
      case '1-week':
        daysToAdd = 7;
        break;
      case '2-weeks':
        daysToAdd = 14;
        break;
      case '1-month':
        daysToAdd = 30;
        break;
      case '2-3-months':
        daysToAdd = 90; // Use maximum of range
        break;
      case 'flexible':
        daysToAdd = 30; // Default to 1 month for flexible
        break;
      default:
        // Fallback: try to parse custom timeline formats like "5 days", "3 weeks", etc.
        const timelineMatch = timeline.match(/(\d+)\s*(day|week|month)s?/i);
        if (timelineMatch) {
          const amount = parseInt(timelineMatch[1]);
          const unit = timelineMatch[2].toLowerCase();
          
          switch (unit) {
            case 'day':
              daysToAdd = amount;
              break;
            case 'week':
              daysToAdd = amount * 7;
              break;
            case 'month':
              daysToAdd = amount * 30;
              break;
          }
        }
    }
    
    deadline.setDate(deadline.getDate() + daysToAdd);

    // Create new task
    const newTask = new Task({
      title,
      description,
      category,
      skills: skills || [],
      reward: parseFloat(budget),
      currency: 'XDC',
      deadline,
      location: 'Remote',
      client: {
        id: clientId,
        name: clientName,
        avatar: clientAvatar || '/placeholder-user.jpg',
        rating: clientRating || 0
      },
      tags: skills || [],
      status: 'open'
    });

    const savedTask = await newTask.save();

    // Generate AI suggestions for the task
    try {
      const freelancers = await User.find({ 
        role: { $in: ['freelancer', 'both'] },
        isActive: true 
      }).limit(20);

      const suggestions = await elizaAI.suggestBestFit(savedTask, freelancers);
      
      if (suggestions.length > 0) {
        savedTask.aiSuggestions = suggestions;
        await savedTask.save();
      }
    } catch (aiError) {
      console.error('Error generating AI suggestions:', aiError);
      // Continue without AI suggestions if there's an error
    }

    return NextResponse.json({
      message: 'Task created successfully',
      task: {
        ...savedTask.toObject(),
        _id: savedTask._id.toString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
} 