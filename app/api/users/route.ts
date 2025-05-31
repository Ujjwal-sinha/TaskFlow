import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET /api/users - Fetch users (for AI suggestions)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const skills = searchParams.get('skills');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query: any = { isActive: true };

    if (role) {
      query.role = { $in: [role, 'both'] };
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray.map(skill => new RegExp(skill, 'i')) };
    }

    const users = await User.find(query)
      .select('name avatar rating totalJobs completedJobs skills role')
      .limit(limit)
      .lean();

    const transformedUsers = users.map(user => ({
      ...user,
      _id: user._id.toString()
    }));

    return NextResponse.json({ users: transformedUsers });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create or update user profile
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      walletAddress,
      name,
      email,
      bio,
      skills,
      role,
      avatar
    } = body;

    if (!walletAddress || !name) {
      return NextResponse.json(
        { error: 'Wallet address and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (user) {
      // Update existing user
      user.name = name;
      if (email) user.email = email;
      if (bio) user.bio = bio;
      if (skills) user.skills = skills;
      if (role) user.role = role;
      if (avatar) user.avatar = avatar;
      
      await user.save();
    } else {
      // Create new user
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        name,
        email,
        bio,
        skills: skills || [],
        role: role || 'both',
        avatar: avatar || '/placeholder-user.jpg'
      });

      await user.save();
    }

    return NextResponse.json({
      message: user.isNew ? 'User created successfully' : 'User updated successfully',
      user: {
        ...user.toObject(),
        _id: user._id.toString()
      }
    });

  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Failed to create/update user' },
      { status: 500 }
    );
  }
} 