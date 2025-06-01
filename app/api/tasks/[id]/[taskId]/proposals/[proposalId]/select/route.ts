// import { NextRequest, NextResponse } from 'next/server'
// import connectDB from '@/lib/mongodb'
// import { Proposal } from '@/lib/models/Proposal'

// // POST /api/tasks/[taskId]/proposals/[proposalId]/select - Select a proposal and assign task
// export async function POST(
//   request: NextRequest,
//   { params }: { params: { taskId: string; proposalId: string } }
// ) {
//   try {
//     await connectDB()
    
//     const { taskId, proposalId } = params
//     const body = await request.json()
//     const { taskOwnerAddress } = body

//     if (!taskOwnerAddress) {
//       return NextResponse.json(
//         { success: false, error: 'Task owner address is required' },
//         { status: 400 }
//       )
//     }

//     // Find the proposal to select
//     const proposal = await Proposal.findById(proposalId)
    
//     if (!proposal) {
//       return NextResponse.json(
//         { success: false, error: 'Proposal not found' },
//         { status: 404 }
//       )
//     }

//     if (proposal.taskId !== taskId) {
//       return NextResponse.json(
//         { success: false, error: 'Proposal does not belong to this task' },
//         { status: 400 }
//       )
//     }

//     if (proposal.status !== 'pending') {
//       return NextResponse.json(
//         { success: false, error: 'Proposal is no longer available for selection' },
//         { status: 400 }
//       )
//     }

//     // Prevent task owner from selecting their own proposal
//     if (proposal.proposerAddress.toLowerCase() === taskOwnerAddress.toLowerCase()) {
//       return NextResponse.json(
//         { success: false, error: 'Task owners cannot select their own proposals' },
//         { status: 403 }
//       )
//     }

//     // Update the selected proposal status
//     proposal.status = 'selected'
//     proposal.updatedAt = new Date()
//     await proposal.save()

//     // Update all other proposals for this task to 'rejected'
//     await Proposal.updateMany(
//       { 
//         taskId, 
//         _id: { $ne: proposalId },
//         status: 'pending'
//       },
//       { 
//         status: 'rejected',
//         updatedAt: new Date()
//       }
//     )

//     return NextResponse.json({
//       success: true,
//       message: 'Proposal selected successfully',
//       selectedProposal: {
//         ...proposal.toObject(),
//         _id: proposal._id.toString()
//       },
//       assignToAddress: proposal.proposerAddress,
//       // This data will be used by the frontend to call the blockchain assignTask function
//       blockchainAction: {
//         type: 'assignTask',
//         taskId: taskId,
//         freelancerAddress: proposal.proposerAddress
//       }
//     })

//   } catch (error) {
//     console.error('Error selecting proposal:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to select proposal' },
//       { status: 500 }
//     )
//   }
// } 