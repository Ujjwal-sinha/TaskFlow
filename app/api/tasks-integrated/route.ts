import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';
import User from '@/lib/models/User';
import { elizaAI } from '@/lib/eliza-ai';
import { ethers } from 'ethers';

// TaskEscrow contract configuration
const TASK_ESCROW_ABI = [
  "function postTask(address _freelancer) payable returns (uint256)",
  "function completeTask(uint256 _taskId)",
  "function cancelTask(uint256 _taskId)",
  "function getTask(uint256 _taskId) view returns (uint256 taskId, address poster, address freelancer, uint256 reward, uint8 status, uint256 createdAt, uint256 completedAt)"
];

const XDC_CONFIG = {
  rpcUrl: 'https://rpc.apothem.network',
  chainId: 51,
};

// POST /api/tasks-integrated - Create task with smart contract integration
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
      freelancerAddress, // The selected freelancer's wallet address
      clientAddress,     // The client's wallet address
      privateKey,        // Client's private key (should be handled securely)
    } = body;

    // Validate required fields
    if (!title || !description || !category || !budget || !freelancerAddress || !clientAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, budget, freelancerAddress, clientAddress' },
        { status: 400 }
      );
    }

    // Validate timeline
    if (!timeline) {
      return NextResponse.json(
        { error: 'Timeline/deadline is required' },
        { status: 400 }
      );
    }

    const deadlineDate = new Date(timeline);
    if (deadlineDate <= new Date()) {
      return NextResponse.json(
        { error: 'Deadline must be in the future' },
        { status: 400 }
      );
    }

    // Validate budget
    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      return NextResponse.json(
        { error: 'Budget must be a positive number' },
        { status: 400 }
      );
    }

    if (!ethers.isAddress(freelancerAddress) || !ethers.isAddress(clientAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet addresses provided' },
        { status: 400 }
      );
    }

    // Create task in database first
    const newTask = new Task({
      title,
      description,
      category,
      reward: budgetNum,
      currency: 'XDC',
      deadline: deadlineDate,
      skills: Array.isArray(skills) ? skills : [],
      client: {
        id: clientAddress,
        name: 'Wallet User',
        address: clientAddress,
        rating: 5.0
      },
      status: 'open',
      tags: Array.isArray(skills) ? skills : [],
      files: [],
      location: 'Remote',
      applicants: [],
    });

    const savedTask = await newTask.save();

    // Deploy to smart contract if private key and contract address are provided
    let contractTaskId = null;
    let txHash = null;
    let contractError = null;

    const contractAddress = process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS;
    
    if (privateKey && contractAddress && contractAddress.trim() !== '') {
      try {
        // Create provider and wallet
        const provider = new ethers.JsonRpcProvider(XDC_CONFIG.rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);

        // Create contract instance
        const contract = new ethers.Contract(
          contractAddress,
          TASK_ESCROW_ABI,
          wallet
        );

        // Convert budget to Wei (XDC)
        const rewardWei = ethers.parseEther(budget.toString());

        // Post task to smart contract
        const tx = await contract.postTask(freelancerAddress, { value: rewardWei });
        const receipt = await tx.wait();

        // Extract contract task ID from events
        const taskPostedEvent = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log);
            return parsed?.name === 'TaskPosted';
          } catch {
            return false;
          }
        });

        if (taskPostedEvent) {
          const parsedEvent = contract.interface.parseLog(taskPostedEvent);
          contractTaskId = Number(parsedEvent?.args[0]);
          txHash = tx.hash;
        }

        // Update database task with contract info
        savedTask.contractTaskId = contractTaskId;
        savedTask.txHash = txHash;
        savedTask.freelancerAddress = freelancerAddress;
        await savedTask.save();

      } catch (error: any) {
        console.error('Smart contract error:', error);
        contractError = error.message;
        // Continue without contract deployment, but log error
        savedTask.contractError = contractError;
        await savedTask.save();
      }
    } else if (!contractAddress || contractAddress.trim() === '') {
      contractError = 'Contract address not configured in environment variables';
      savedTask.contractError = contractError;
      await savedTask.save();
    } else if (!privateKey) {
      contractError = 'Private key not provided';
      savedTask.contractError = contractError;
      await savedTask.save();
    }

    return NextResponse.json({
      message: 'Task created successfully',
      task: {
        ...savedTask.toObject(),
        _id: savedTask._id.toString(),
        contractTaskId,
        txHash
      },
      warnings: contractError ? [`Contract deployment failed: ${contractError}`] : []
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating integrated task:', error);
    return NextResponse.json(
      { error: `Failed to create task: ${error.message}` },
      { status: 500 }
    );
  }
}

// PUT /api/tasks-integrated - Apply for job and get Eliza analysis
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { taskId, applicantAddress, proposal, bidAmount } = body;

    if (!taskId || !applicantAddress || !proposal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!ethers.isAddress(applicantAddress)) {
      return NextResponse.json(
        { error: 'Invalid applicant address' },
        { status: 400 }
      );
    }

    // Get task details
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Get or create applicant user profile
    let applicant = await User.findOne({ walletAddress: applicantAddress });
    
    if (!applicant) {
      // Create basic profile for new wallet user
      applicant = new User({
        name: `User ${applicantAddress.substring(0, 6)}`,
        walletAddress: applicantAddress,
        role: 'freelancer',
        skills: [], // Will be updated when they complete profile
        rating: 4.0,
        totalJobs: 0,
        completedJobs: 0,
        isActive: true
      });
      await applicant.save();
    }

    // Add application to task
    const application = {
      userId: applicant._id.toString(),
      userName: applicant.name,
      userAvatar: applicant.avatar,
      userRating: applicant.rating,
      appliedAt: new Date(),
      proposal: proposal,
      bidAmount: bidAmount || task.reward,
      walletAddress: applicantAddress
    };

    task.applicants.push(application);
    await task.save();

    // Get all applicants for Eliza analysis
    const allApplicants = await User.find({
      _id: { $in: task.applicants.map((app: any) => app.userId) }
    });

    // Generate Eliza AI suggestions for this new applicant
    const elizaSuggestions = await elizaAI.suggestBestFit(task, allApplicants);

    // Find suggestion for this specific applicant
    const applicantSuggestion = elizaSuggestions.find(
      suggestion => suggestion.userId === applicant._id.toString()
    );

    // Update task with new AI suggestions
    task.aiSuggestions = elizaSuggestions;
    await task.save();

    return NextResponse.json({
      message: 'Application submitted successfully',
      application: {
        ...application,
        elizaAnalysis: applicantSuggestion || {
          matchScore: 0,
          reason: 'No analysis available'
        }
      },
      allSuggestions: elizaSuggestions,
      taskId: task._id.toString()
    });

  } catch (error) {
    console.error('Error processing job application:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks-integrated - Complete task and release payment
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { taskId, action, privateKey } = body;

    if (!taskId || !action) {
      return NextResponse.json(
        { error: 'Missing taskId or action' },
        { status: 400 }
      );
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    let txHash = null;

    if (action === 'complete' && task.contractTaskId && privateKey) {
      try {
        // Create provider and wallet
        const provider = new ethers.JsonRpcProvider(XDC_CONFIG.rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);

        // Create contract instance
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS!,
          TASK_ESCROW_ABI,
          wallet
        );

        // Complete task on smart contract
        const tx = await contract.completeTask(task.contractTaskId);
        await tx.wait();
        txHash = tx.hash;

        // Update database
        task.status = 'completed';
        task.completedAt = new Date();
        task.completionTxHash = txHash;
        await task.save();

      } catch (contractError: any) {
        console.error('Smart contract completion error:', contractError);
        return NextResponse.json(
          { error: `Contract completion failed: ${contractError.message}` },
          { status: 500 }
        );
      }
    } else if (action === 'cancel' && task.contractTaskId && privateKey) {
      try {
        // Similar logic for cancellation
        const provider = new ethers.JsonRpcProvider(XDC_CONFIG.rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS!,
          TASK_ESCROW_ABI,
          wallet
        );

        const tx = await contract.cancelTask(task.contractTaskId);
        await tx.wait();
        txHash = tx.hash;

        task.status = 'cancelled';
        task.cancellationTxHash = txHash;
        await task.save();

      } catch (contractError: any) {
        console.error('Smart contract cancellation error:', contractError);
        return NextResponse.json(
          { error: `Contract cancellation failed: ${contractError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: `Task ${action}d successfully`,
      task: {
        ...task.toObject(),
        _id: task._id.toString()
      },
      txHash
    });

  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
} 