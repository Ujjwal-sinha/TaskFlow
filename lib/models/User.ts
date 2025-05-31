import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  rating: number;
  totalJobs: number;
  completedJobs: number;
  role: 'freelancer' | 'client' | 'both';
  portfolio?: Array<{
    title: string;
    description: string;
    image?: string;
    url?: string;
  }>;
  reviews: Array<{
    fromUserId: string;
    fromUserName: string;
    rating: number;
    comment: string;
    taskId: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  preferences?: {
    categories: string[];
    minBudget?: number;
    maxBudget?: number;
    workload: 'part-time' | 'full-time' | 'project-based';
  };
}

const UserSchema = new Schema<IUser>({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: '/placeholder-user.jpg'
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  skills: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalJobs: {
    type: Number,
    default: 0,
    min: 0
  },
  completedJobs: {
    type: Number,
    default: 0,
    min: 0
  },
  role: {
    type: String,
    enum: ['freelancer', 'client', 'both'],
    default: 'both'
  },
  portfolio: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String
    },
    url: {
      type: String
    }
  }],
  reviews: [{
    fromUserId: {
      type: String,
      required: true
    },
    fromUserName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    taskId: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    categories: [{
      type: String
    }],
    minBudget: {
      type: Number,
      min: 0
    },
    maxBudget: {
      type: Number,
      min: 0
    },
    workload: {
      type: String,
      enum: ['part-time', 'full-time', 'project-based'],
      default: 'project-based'
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
UserSchema.index({ walletAddress: 1 });
UserSchema.index({ skills: 1 });
UserSchema.index({ rating: -1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 