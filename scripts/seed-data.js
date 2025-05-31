const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';

// User Schema
const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, trim: true, lowercase: true },
  avatar: { type: String, default: '/placeholder-user.jpg' },
  bio: { type: String, trim: true, maxlength: 1000 },
  skills: [{ type: String, trim: true }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalJobs: { type: Number, default: 0, min: 0 },
  completedJobs: { type: Number, default: 0, min: 0 },
  role: { type: String, enum: ['freelancer', 'client', 'both'], default: 'both' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Task Schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  category: { type: String, required: true, enum: ['Design', 'Development', 'Writing', 'Marketing', 'Video', 'Audio', 'Business', 'Data', 'Translation', 'Blockchain', 'Other'] },
  reward: { type: Number, required: true, min: 0 },
  currency: { type: String, required: true, default: 'XDC' },
  deadline: { type: Date, required: true },
  location: { type: String, required: true, default: 'Remote' },
  client: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '/placeholder-user.jpg' },
    rating: { type: Number, default: 0, min: 0, max: 5 }
  },
  applicants: [{
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: '/placeholder-user.jpg' },
    userRating: { type: Number, default: 0, min: 0, max: 5 },
    appliedAt: { type: Date, default: Date.now },
    proposal: { type: String, required: true },
    bidAmount: { type: Number, min: 0 }
  }],
  tags: [{ type: String, trim: true }],
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'cancelled'], default: 'open' },
  skills: [{ type: String, trim: true }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

// Sample data
const sampleUsers = [
  {
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    bio: 'Experienced UI/UX designer with 5+ years in the industry',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'],
    rating: 4.8,
    totalJobs: 25,
    completedJobs: 23,
    role: 'freelancer'
  },
  {
    walletAddress: '0x2345678901bcdef12345678901bcdef123456789',
    name: 'Bob Smith',
    email: 'bob@example.com',
    bio: 'Full-stack developer specializing in React and Node.js',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    rating: 4.9,
    totalJobs: 18,
    completedJobs: 17,
    role: 'freelancer'
  },
  {
    walletAddress: '0x3456789012cdef123456789012cdef1234567890',
    name: 'Carol Davis',
    email: 'carol@example.com',
    bio: 'Content writer and marketing specialist',
    skills: ['Content Writing', 'SEO', 'Social Media', 'Marketing'],
    rating: 4.7,
    totalJobs: 30,
    completedJobs: 28,
    role: 'freelancer'
  },
  {
    walletAddress: '0x4567890123def1234567890123def12345678901',
    name: 'TechCorp Inc.',
    email: 'contact@techcorp.com',
    bio: 'Leading technology company looking for talented freelancers',
    skills: [],
    rating: 4.5,
    totalJobs: 12,
    completedJobs: 10,
    role: 'client'
  }
];

const sampleTasks = [
  {
    title: 'Design a Modern Landing Page for SaaS Product',
    description: 'Looking for a talented UI/UX designer to create a modern, conversion-focused landing page for our new SaaS product. Must be responsive and follow current design trends.',
    category: 'Design',
    reward: 500,
    currency: 'XDC',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    location: 'Remote',
    client: {
      id: '0x4567890123def1234567890123def12345678901',
      name: 'TechCorp Inc.',
      avatar: '/placeholder-user.jpg',
      rating: 4.5
    },
    tags: ['UI/UX', 'Figma', 'Web Design', 'Landing Page'],
    skills: ['UI/UX Design', 'Figma', 'Web Design'],
    status: 'open'
  },
  {
    title: 'Full-Stack Web Application Development',
    description: 'Need an experienced developer to build a full-stack web application with React, Node.js, and PostgreSQL. Project includes user authentication, dashboard, and API integration.',
    category: 'Development',
    reward: 1200,
    currency: 'XDC',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    location: 'Remote',
    client: {
      id: '0x4567890123def1234567890123def12345678901',
      name: 'TechCorp Inc.',
      avatar: '/placeholder-user.jpg',
      rating: 4.5
    },
    tags: ['React', 'Node.js', 'PostgreSQL', 'Full-Stack'],
    skills: ['React', 'Node.js', 'PostgreSQL'],
    status: 'open'
  },
  {
    title: 'Content Writing for Tech Blog',
    description: 'Seeking a skilled content writer to create engaging blog posts about emerging technologies, AI, and blockchain. Must have technical writing experience.',
    category: 'Writing',
    reward: 200,
    currency: 'XDC',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    location: 'Remote',
    client: {
      id: '0x4567890123def1234567890123def12345678901',
      name: 'TechCorp Inc.',
      avatar: '/placeholder-user.jpg',
      rating: 4.5
    },
    tags: ['Content Writing', 'Tech', 'Blog', 'SEO'],
    skills: ['Content Writing', 'Technical Writing', 'SEO'],
    status: 'open'
  },
  {
    title: 'Smart Contract Development',
    description: 'Looking for a blockchain developer to create smart contracts for a DeFi protocol. Experience with Solidity and Web3 technologies required.',
    category: 'Blockchain',
    reward: 2000,
    currency: 'XDC',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    location: 'Remote',
    client: {
      id: '0x4567890123def1234567890123def12345678901',
      name: 'TechCorp Inc.',
      avatar: '/placeholder-user.jpg',
      rating: 4.5
    },
    tags: ['Solidity', 'Smart Contracts', 'DeFi', 'Web3'],
    skills: ['Blockchain', 'Smart Contracts', 'Solidity'],
    status: 'open'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    console.log(`Inserted ${users.length} users`);

    // Insert sample tasks
    const tasks = await Task.insertMany(sampleTasks);
    console.log(`Inserted ${tasks.length} tasks`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase(); 