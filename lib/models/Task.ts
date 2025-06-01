import mongoose, { Schema, Document } from 'mongoose';
export interface ITask extends Document {
  title: string;
  description: string;
  category: string;
  reward: number;
  currency: string;
  deadline: Date;
  location: string;
  client: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    address?: string; // Wallet address
  };
  applicants: Array<{
    userId: string;
    userName: string;
    userAvatar?: string;
    userRating: number;
    appliedAt: Date;
    proposal: string;
    bidAmount?: number;
    walletAddress?: string; // Freelancer's wallet address
  }>;
  tags: string[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  files?: string[];
  skills: string[];
  aiSuggestions?: Array<{
    userId: string;
    userName: string;
    matchScore: number;
    reason: string;
  }>;
  // Smart contract integration fields
  contractTaskId?: number;
  txHash?: string;
  freelancerAddress?: string;
  contractError?: string;
  completionTxHash?: string;
  cancellationTxHash?: string;
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Design',
      'Development',
      'Writing',
      'Marketing',
      'Video',
      'Blockchain',
      'Data',
      'Audio',
      'Business',
      'Translation'
    ]
  },
  reward: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'XDC',
    enum: ['XDC', 'USD', 'EUR']
  },
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: function(v: Date) {
        return v > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  location: {
    type: String,
    default: 'Remote'
  },
  client: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5
    },
    address: {
      type: String // Wallet address
    }
  },
  applicants: [{
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userAvatar: {
      type: String
    },
    userRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    proposal: {
      type: String,
      required: true,
      maxlength: 1000
    },
    bidAmount: {
      type: Number,
      min: 0
    },
    walletAddress: {
      type: String // Freelancer's wallet address
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  files: [{
    type: String
  }],
  skills: [{
    type: String,
    trim: true
  }],
  aiSuggestions: [{
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    reason: {
      type: String
    }
  }],
  // Smart contract integration fields
  contractTaskId: {
    type: Number
  },
  txHash: {
    type: String
  },
  freelancerAddress: {
    type: String
  },
  contractError: {
    type: String
  },
  completionTxHash: {
    type: String
  },
  cancellationTxHash: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better search performance
TaskSchema.index({ title: 'text', description: 'text', tags: 'text' });
TaskSchema.index({ category: 1, status: 1 });
TaskSchema.index({ reward: 1 });
TaskSchema.index({ deadline: 1 });
TaskSchema.index({ contractTaskId: 1 });
TaskSchema.index({ 'client.address': 1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema); 