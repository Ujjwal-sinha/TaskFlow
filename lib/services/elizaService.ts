interface TaskDetails {
  title: string
  description: string
  category: string
  skills: string[]
  reward: number
  deadline: string
}

interface ProposalData {
  proposal: string
  bidAmount: number
  estimatedDuration: string
  deliverables: string[]
  proposerExperience?: string
}

interface AIAnalysis {
  matchScore: number
  reason: string
  strengths: string[]
  concerns: string[]
}

interface AISuggestion {
  proposal: string
  bidAmount: number
  estimatedDuration: string
  deliverables: string[]
  reasoning: string
  confidence: number
}

class ElizaService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.ELIZA_API_KEY || ''
    this.baseUrl = process.env.ELIZA_API_URL || 'https://api.eliza.ai'
  }

  /**
   * Analyze a proposal against a task using Eliza AI
   */
  async analyzeProposal(task: TaskDetails, proposal: ProposalData): Promise<AIAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(task, proposal)
      
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt,
          task: 'proposal_analysis',
          context: {
            task,
            proposal
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze proposal with Eliza')
      }

      const result = await response.json()
      return this.parseAnalysisResponse(result)
    } catch (error) {
      console.error('Eliza analysis error:', error)
      // Return fallback analysis
      return this.getFallbackAnalysis(task, proposal)
    }
  }

  /**
   * Generate AI-suggested proposals for a task
   */
  async generateSuggestions(task: TaskDetails, count: number = 3): Promise<AISuggestion[]> {
    try {
      const prompt = this.buildSuggestionPrompt(task)
      
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt,
          task: 'proposal_generation',
          context: { task },
          options: {
            count,
            creativity: 0.7,
            focus: 'practical'
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions with Eliza')
      }

      const result = await response.json()
      return this.parseSuggestionResponse(result, task)
    } catch (error) {
      console.error('Eliza suggestion error:', error)
      // Return fallback suggestions
      return this.getFallbackSuggestions(task, count)
    }
  }

  private buildAnalysisPrompt(task: TaskDetails, proposal: ProposalData): string {
    return `
Analyze this freelancer proposal for the given task and provide a detailed assessment:

TASK:
Title: ${task.title}
Description: ${task.description}
Category: ${task.category}
Required Skills: ${task.skills.join(', ')}
Budget: ${task.reward} XDC
Deadline: ${task.deadline}

PROPOSAL:
${proposal.proposal}
Bid Amount: ${proposal.bidAmount} XDC
Estimated Duration: ${proposal.estimatedDuration}
Deliverables: ${proposal.deliverables.join(', ')}

Please analyze and provide:
1. Match Score (0-100): How well does this proposal fit the task?
2. Reason: Brief explanation of the score
3. Strengths: What are the proposal's strong points?
4. Concerns: What potential issues do you see?

Focus on technical fit, budget alignment, timeline feasibility, and deliverable clarity.
`
  }

  private buildSuggestionPrompt(task: TaskDetails): string {
    return `
Generate high-quality freelancer proposals for this task:

TASK:
Title: ${task.title}
Description: ${task.description}
Category: ${task.category}
Required Skills: ${task.skills.join(', ')}
Budget: ${task.reward} XDC
Deadline: ${task.deadline}

Generate 3 different proposal approaches:
1. Conservative approach (safe, established methods)
2. Innovative approach (creative, cutting-edge solutions)
3. Value approach (maximum value within budget)

For each proposal, include:
- Compelling proposal text (200-400 words)
- Competitive bid amount
- Realistic timeline
- Clear deliverables
- Reasoning for the approach

Make proposals professional, specific, and tailored to the task requirements.
`
  }

  private parseAnalysisResponse(result: any): AIAnalysis {
    return {
      matchScore: Math.min(100, Math.max(0, result.matchScore || 75)),
      reason: result.reason || 'Good alignment with task requirements',
      strengths: Array.isArray(result.strengths) ? result.strengths : [
        'Professional presentation',
        'Relevant experience mentioned'
      ],
      concerns: Array.isArray(result.concerns) ? result.concerns : []
    }
  }

  private parseSuggestionResponse(result: any, task: TaskDetails): AISuggestion[] {
    if (!Array.isArray(result.suggestions)) {
      return this.getFallbackSuggestions(task, 3)
    }

    return result.suggestions.map((suggestion: any) => ({
      proposal: suggestion.proposal || 'AI-generated proposal content',
      bidAmount: suggestion.bidAmount || Math.round(task.reward * 0.9),
      estimatedDuration: suggestion.estimatedDuration || '2-3 weeks',
      deliverables: Array.isArray(suggestion.deliverables) ? suggestion.deliverables : [
        'Complete project files',
        'Documentation',
        'Testing and support'
      ],
      reasoning: suggestion.reasoning || 'AI-optimized approach',
      confidence: Math.min(100, Math.max(0, suggestion.confidence || 85))
    }))
  }

  private getFallbackAnalysis(task: TaskDetails, proposal: ProposalData): AIAnalysis {
    // Basic heuristic analysis when AI is unavailable
    let score = 70

    // Budget alignment
    const budgetRatio = proposal.bidAmount / task.reward
    if (budgetRatio <= 1.0) score += 10
    if (budgetRatio > 1.2) score -= 20

    // Proposal length (reasonable detail)
    if (proposal.proposal.length > 200 && proposal.proposal.length < 1000) score += 10

    // Has deliverables
    if (proposal.deliverables.length > 0) score += 10

    return {
      matchScore: Math.min(100, Math.max(0, score)),
      reason: 'Automated analysis based on proposal completeness and budget alignment',
      strengths: [
        'Proposal includes key details',
        'Budget is within reasonable range'
      ],
      concerns: budgetRatio > 1.1 ? ['Bid amount exceeds task budget'] : []
    }
  }

  private getFallbackSuggestions(task: TaskDetails, count: number): AISuggestion[] {
    const suggestions: AISuggestion[] = []
    
    const approaches = [
      {
        name: 'Conservative',
        multiplier: 0.95,
        duration: '3-4 weeks'
      },
      {
        name: 'Innovative', 
        multiplier: 0.85,
        duration: '2-3 weeks'
      },
      {
        name: 'Value',
        multiplier: 0.9,
        duration: '2-4 weeks'
      }
    ]

    for (let i = 0; i < Math.min(count, approaches.length); i++) {
      const approach = approaches[i]
      suggestions.push({
        proposal: `I am excited to work on your ${task.category.toLowerCase()} project "${task.title}". With expertise in ${task.skills.slice(0, 3).join(', ')}, I can deliver high-quality results that meet your requirements. My ${approach.name.toLowerCase()} approach will ensure efficient execution while maintaining excellent standards.`,
        bidAmount: Math.round(task.reward * approach.multiplier),
        estimatedDuration: approach.duration,
        deliverables: [
          'Complete project implementation',
          'Source code and documentation', 
          'Testing and quality assurance',
          'Post-delivery support'
        ],
        reasoning: `${approach.name} approach balancing quality, timeline, and budget`,
        confidence: 80
      })
    }

    return suggestions
  }
}

export const elizaService = new ElizaService() 