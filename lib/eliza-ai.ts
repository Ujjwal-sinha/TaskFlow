import { IUser } from './models/User';
import { ITask } from './models/Task';

interface MatchResult {
  userId: string;
  userName: string;
  matchScore: number;
  reason: string;
}

export class ElizaAIService {
  private static instance: ElizaAIService;

  private constructor() {}

  public static getInstance(): ElizaAIService {
    if (!ElizaAIService.instance) {
      ElizaAIService.instance = new ElizaAIService();
    }
    return ElizaAIService.instance;
  }

  /**
   * Analyze a task and suggest the best fit freelancers
   */
  async suggestBestFit(task: ITask, availableFreelancers: IUser[]): Promise<MatchResult[]> {
    try {
      const suggestions: MatchResult[] = [];

      for (const freelancer of availableFreelancers) {
        const matchScore = this.calculateMatchScore(task, freelancer);
        const reason = this.generateMatchReason(task, freelancer, matchScore);

        if (matchScore > 30) { // Only include freelancers with >30% match
          suggestions.push({
            userId: freelancer._id.toString(),
            userName: freelancer.name,
            matchScore,
            reason
          });
        }
      }

      // Sort by match score (highest first)
      suggestions.sort((a, b) => b.matchScore - a.matchScore);

      // Return top 5 suggestions
      return suggestions.slice(0, 5);
    } catch (error) {
      console.error('Error in Eliza AI suggestion:', error);
      return [];
    }
  }

  /**
   * Calculate match score between task and freelancer
   */
  private calculateMatchScore(task: ITask, freelancer: IUser): number {
    let score = 0;
    let maxScore = 0;

    // Skills match (40% weight)
    const skillsWeight = 40;
    const skillsMatch = this.calculateSkillsMatch(task.skills, freelancer.skills);
    score += skillsMatch * skillsWeight;
    maxScore += skillsWeight;

    // Category experience (20% weight)
    const categoryWeight = 20;
    const categoryMatch = freelancer.skills.some(skill => 
      this.getCategorySkills(task.category).includes(skill.toLowerCase())
    ) ? 1 : 0;
    score += categoryMatch * categoryWeight;
    maxScore += categoryWeight;

    // Rating (20% weight)
    const ratingWeight = 20;
    const ratingScore = freelancer.rating / 5; // Normalize to 0-1
    score += ratingScore * ratingWeight;
    maxScore += ratingWeight;

    // Experience (completion rate) (10% weight)
    const experienceWeight = 10;
    const completionRate = freelancer.totalJobs > 0 ? 
      freelancer.completedJobs / freelancer.totalJobs : 0;
    score += completionRate * experienceWeight;
    maxScore += experienceWeight;

    // Activity status (10% weight)
    const activityWeight = 10;
    const activityScore = freelancer.isActive ? 1 : 0;
    score += activityScore * activityWeight;
    maxScore += activityWeight;

    return Math.round((score / maxScore) * 100);
  }

  /**
   * Calculate skills match percentage
   */
  private calculateSkillsMatch(taskSkills: string[], freelancerSkills: string[]): number {
    if (taskSkills.length === 0) return 0;

    const taskSkillsLower = taskSkills.map(skill => skill.toLowerCase());
    const freelancerSkillsLower = freelancerSkills.map(skill => skill.toLowerCase());

    const matchingSkills = taskSkillsLower.filter(skill => 
      freelancerSkillsLower.includes(skill)
    );

    return matchingSkills.length / taskSkillsLower.length;
  }

  /**
   * Get relevant skills for a category
   */
  private getCategorySkills(category: string): string[] {
    const categorySkillsMap: { [key: string]: string[] } = {
      'Design': ['ui/ux design', 'graphic design', 'logo design', 'web design', 'mobile design', 'figma', 'photoshop', 'illustrator'],
      'Development': ['react', 'vue.js', 'angular', 'node.js', 'python', 'java', 'php', 'ruby', 'javascript', 'typescript'],
      'Writing': ['content writing', 'copywriting', 'technical writing', 'blog writing', 'seo'],
      'Marketing': ['seo', 'social media', 'email marketing', 'ppc', 'content marketing', 'digital marketing'],
      'Video': ['video editing', 'animation', 'motion graphics', 'after effects', 'premiere pro'],
      'Blockchain': ['solidity', 'smart contracts', 'web3', 'defi', 'blockchain'],
      'Data': ['data analysis', 'machine learning', 'python', 'sql', 'tableau', 'power bi'],
      'Audio': ['audio editing', 'sound design', 'music production', 'voice over'],
      'Business': ['business analysis', 'project management', 'consulting', 'strategy'],
      'Translation': ['translation', 'localization', 'proofreading', 'editing']
    };

    return categorySkillsMap[category] || [];
  }

  /**
   * Generate human-readable match reason
   */
  private generateMatchReason(task: ITask, freelancer: IUser, matchScore: number): string {
    const reasons: string[] = [];

    // Skills match
    const matchingSkills = task.skills.filter(skill => 
      freelancer.skills.some(fSkill => 
        fSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    if (matchingSkills.length > 0) {
      reasons.push(`Has ${matchingSkills.length} matching skills: ${matchingSkills.slice(0, 3).join(', ')}`);
    }

    // Rating
    if (freelancer.rating >= 4.5) {
      reasons.push(`Excellent rating (${freelancer.rating}/5)`);
    } else if (freelancer.rating >= 4.0) {
      reasons.push(`Good rating (${freelancer.rating}/5)`);
    }

    // Experience
    if (freelancer.completedJobs >= 10) {
      reasons.push(`Experienced with ${freelancer.completedJobs} completed jobs`);
    } else if (freelancer.completedJobs >= 5) {
      reasons.push(`${freelancer.completedJobs} completed jobs`);
    }

    // Category experience
    const categorySkills = this.getCategorySkills(task.category);
    const hasCategoryExperience = freelancer.skills.some(skill => 
      categorySkills.includes(skill.toLowerCase())
    );

    if (hasCategoryExperience) {
      reasons.push(`Specialized in ${task.category}`);
    }

    if (reasons.length === 0) {
      reasons.push('Profile matches basic requirements');
    }

    return reasons.slice(0, 3).join(', ');
  }

  /**
   * Analyze task requirements and suggest improvements
   */
  async analyzeTaskRequirements(task: Partial<ITask>): Promise<{
    suggestions: string[];
    estimatedBudget?: { min: number; max: number };
    estimatedDuration?: string;
  }> {
    const suggestions: string[] = [];
    
    // Analyze title
    if (!task.title || task.title.length < 10) {
      suggestions.push('Consider adding more details to your task title');
    }

    // Analyze description
    if (!task.description || task.description.length < 50) {
      suggestions.push('Provide a more detailed description to attract better proposals');
    }

    // Analyze skills
    if (!task.skills || task.skills.length === 0) {
      suggestions.push('Add required skills to help freelancers understand your needs');
    }

    // Budget estimation based on category and complexity
    const estimatedBudget = this.estimateBudget(task.category, task.description || '');
    const estimatedDuration = this.estimateDuration(task.category, task.description || '');

    return {
      suggestions,
      estimatedBudget,
      estimatedDuration
    };
  }

  private estimateBudget(category?: string, description?: string): { min: number; max: number } {
    const baseBudgets: { [key: string]: { min: number; max: number } } = {
      'Design': { min: 200, max: 1000 },
      'Development': { min: 500, max: 3000 },
      'Writing': { min: 100, max: 500 },
      'Marketing': { min: 300, max: 1500 },
      'Video': { min: 250, max: 1200 },
      'Blockchain': { min: 1000, max: 5000 },
      'Data': { min: 400, max: 2000 },
      'Audio': { min: 150, max: 800 },
      'Business': { min: 300, max: 1500 },
      'Translation': { min: 100, max: 600 }
    };

    const base = baseBudgets[category || 'Other'] || { min: 200, max: 1000 };
    
    // Adjust based on description complexity
    const complexityMultiplier = description && description.length > 200 ? 1.5 : 1;
    
    return {
      min: Math.round(base.min * complexityMultiplier),
      max: Math.round(base.max * complexityMultiplier)
    };
  }

  private estimateDuration(category?: string, description?: string): string {
    const baseDurations: { [key: string]: string } = {
      'Design': '3-7 days',
      'Development': '1-4 weeks',
      'Writing': '2-5 days',
      'Marketing': '1-2 weeks',
      'Video': '3-10 days',
      'Blockchain': '2-6 weeks',
      'Data': '1-3 weeks',
      'Audio': '2-7 days',
      'Business': '1-2 weeks',
      'Translation': '1-3 days'
    };

    return baseDurations[category || 'Other'] || '1-2 weeks';
  }
}

export const elizaAI = ElizaAIService.getInstance(); 