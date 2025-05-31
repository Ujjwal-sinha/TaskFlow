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
  };
  applicants: Array<{
    userId: string;
    userName: string;
    userAvatar?: string;
    userRating: number;
    appliedAt: Date;
    proposal: string;
    bidAmount?: number;
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
    maxlength: 5000
  },
  category: {
    type: String,
    required: true,
    enum: ['Design', 'Development', 'Writing', 'Marketing', 'Video', 'Audio', 'Business', 'Data', 'Translation', 'Blockchain', 'Other']
  },
  reward: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'XDC'
  },
  deadline: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
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
      type: String,
      default: '/placeholder-user.jpg'
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
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
      type: String,
      default: '/placeholder-user.jpg'
    },
    userRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    proposal: {
      type: String,
      required: true
    },
    bidAmount: {
      type: Number,
      min: 0
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
  }]
}, {
  timestamps: true
});

// Index for better search performance
TaskSchema.index({ title: 'text', description: 'text', tags: 'text' });
TaskSchema.index({ category: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ createdAt: -1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema); 