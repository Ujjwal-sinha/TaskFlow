# TaskFlow - Decentralized Freelance Marketplace

A modern, AI-powered freelance marketplace built with Next.js, MongoDB, and Eliza OS for intelligent task-freelancer matching.

## Features

- 🎯 **Smart Task Posting**: AI-powered task analysis and budget estimation
- 🤖 **Intelligent Matching**: Eliza OS integration for suggesting best-fit freelancers
- 💼 **Dual Roles**: Users can be both clients and freelancers
- 🔍 **Advanced Search**: Filter tasks by category, skills, budget, and timeline
- 💰 **XDC Integration**: Built for XDC Network with crypto payments
- 📱 **Responsive Design**: Modern UI with smooth animations
- 🔐 **Web3 Authentication**: Civic Auth integration for wallet-based login

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **AI**: Eliza OS for intelligent matching and suggestions
- **Authentication**: Civic Auth Web3
- **UI Components**: Radix UI, Framer Motion
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ 
- pnpm
- MongoDB (local or MongoDB Atlas)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TaskFlow
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/taskflow

# For production, use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority

# Next.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# OpenAI API Key (optional, for enhanced AI features)
OPENAI_API_KEY=your-openai-api-key-here

# Application Settings
NODE_ENV=development
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically connect to `mongodb://localhost:27017/taskflow`

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 5. Seed Sample Data

Populate the database with sample users and tasks:

```bash
pnpm seed
```

### 6. Run the Application

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Workflow 

      🧑‍💼 Client                      🧑‍💻 Freelancer
          │                                 │
  Post Task ─────▶ 🧠 Eliza OS (Groq) ◀───── Submit Proposal
          │             │                           │
   View Suggestions ◀── Analyze Proposal ───▶ Match Score
          │                                 │
   Accept Proposal                     Get Feedback
          │                                 │
       Smart Contract Escrow (XDC)

## Project Structure

```
TaskFlow/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── tasks/         # Task management endpoints
│   │   ├── users/         # User management endpoints
│   │   └── ai-suggestions/ # AI-powered suggestions
│   ├── marketplace/       # Marketplace page
│   ├── post-task/         # Task posting page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── custom/           # Custom components
├── lib/                  # Utilities and configurations
│   ├── models/           # MongoDB models
│   ├── mongodb.ts        # Database connection
│   └── eliza-ai.ts       # AI service integration
├── scripts/              # Utility scripts
│   └── seed-data.js      # Database seeding
└── styles/               # Global styles
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Fetch tasks with filtering and pagination
- `POST /api/tasks` - Create a new task

### Users
- `GET /api/users` - Fetch users (for AI suggestions)
- `POST /api/users` - Create or update user profile

### AI Suggestions
- `POST /api/ai-suggestions` - Get AI-powered freelancer suggestions
- `GET /api/ai-suggestions/analyze` - Analyze task requirements

## Key Features

### AI-Powered Matching

The application uses Eliza OS to:
- Analyze task requirements
- Suggest optimal budget ranges
- Estimate project duration
- Match freelancers based on skills, experience, and ratings
- Provide intelligent recommendations

### User Roles

Users can switch between roles:
- **Client**: Post tasks, hire freelancers
- **Freelancer**: Browse tasks, submit proposals
- **Both**: Full access to all features

### Task Management

- Create detailed task descriptions
- Set budgets and timelines
- Upload attachments
- Track applications
- AI-powered suggestions during creation

### Search & Filtering

- Search by keywords, skills, or categories
- Filter by budget range, timeline, and location
- Sort by newest, budget, or popularity
- Real-time search with debouncing

## Development

### Adding New Features

1. **Database Models**: Add new schemas in `lib/models/`
2. **API Routes**: Create endpoints in `app/api/`
3. **Components**: Build reusable components in `components/`
4. **Pages**: Add new pages in `app/`

### AI Integration

The Eliza OS integration provides:
- Skill matching algorithms
- Budget estimation based on category and complexity
- Duration predictions
- Freelancer ranking and scoring

### Styling

- Uses Tailwind CSS for styling
- Custom color scheme with CSS variables
- Responsive design with mobile-first approach
- Smooth animations with Framer Motion

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

Built with ❤️ for the XDC Network ecosystem