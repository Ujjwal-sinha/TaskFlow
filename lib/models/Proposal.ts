import mongoose from 'mongoose'

const proposalSchema = new mongoose.Schema({
  // Blockchain task ID reference
  taskId: {
    type: String,
    required: true,
    index: true
  },
  
  // Proposer information
  proposerAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  proposerName: {
    type: String,
    required: true
  },
  proposerAvatar: {
    type: String,
    default: ''
  },
  proposerRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // Proposal details
  proposal: {
    type: String,
    required: true,
    maxlength: 2000
  },
  bidAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'XDC'
  },
  
  // Timeline and deliverables
  estimatedDuration: {
    type: String,
    required: true
  },
  deliverables: [{
    type: String
  }],
  
  // AI Analysis
  aiAnalysis: {
    matchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    reason: {
      type: String
    },
    strengths: [{
      type: String
    }],
    concerns: [{
      type: String
    }]
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'selected', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Indexes for better query performance
proposalSchema.index({ taskId: 1, proposerAddress: 1 }, { unique: true })
proposalSchema.index({ proposerAddress: 1 })
proposalSchema.index({ status: 1 })
proposalSchema.index({ createdAt: -1 })

export const Proposal = mongoose.models.Proposal || mongoose.model('Proposal', proposalSchema) 