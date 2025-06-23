import { createGroq } from "@ai-sdk/groq";
import type { IAgentRuntime, Memory, Plugin, State } from "@elizaos/core";
import type { LanguageModelV1Prompt } from "@ai-sdk/provider";

// Types for task and freelancer
export interface LlamaTask {
  title: string;
  description: string;
  category: string;
  skills: string[];
}
export interface LlamaFreelancer {
  userId: string;
  name: string;
  skills: string[];
  rating: number;
  completedJobs: number;
  isActive: boolean;
}

// Create a Groq provider instance
export const groqProvider = createGroq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

// Export a Llama-3.3-70b-versatile model instance for recommendations
export const llamaRecommenderModel = groqProvider(
  "llama-3.3-70b-versatile" as any // Type assertion, as modelId is not in the default union
);

/**
 * Recommend freelancers for a given task using the Llama model.
 * @param {LlamaTask} task - The task object containing title, description, category, skills, etc.
 * @param {LlamaFreelancer[]} freelancers - List of freelancer objects to consider.
 * @returns {Promise<Array>} - List of recommended freelancers with scores and reasons.
 */
export async function recommendFreelancersWithLlama(
  task: LlamaTask,
  freelancers: LlamaFreelancer[]
): Promise<{
  userId: string;
  userName: string;
  matchScore: number;
  reason: string;
}[]> {
  // Prepare prompt for the Llama model
  const prompt: LanguageModelV1Prompt = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Given the following task and list of freelancers, recommend the top 5 best matches.\n\nTask:\nTitle: ${task.title}\nDescription: ${task.description}\nCategory: ${task.category}\nSkills: ${task.skills?.join(", ") || "N/A"}\n\nFreelancers:\n${freelancers.map((f, i) => `${i+1}. Name: ${f.name}, Skills: ${f.skills?.join(", ")}, Rating: ${f.rating}, Completed Jobs: ${f.completedJobs}, Active: ${f.isActive}`).join("\n")}\n\nFor each recommended freelancer, provide:\n- userId\n- userName\n- matchScore (0-100)\n- reason (short explanation)\n\nRespond as a JSON array.`
        }
      ]
    }
  ];

  const response = await llamaRecommenderModel.doGenerate({
      prompt,
      maxTokens: 512,
      temperature: 0.3,
      inputFormat: 'messages',
      mode: {
          type: "regular",
          tools: undefined,
          toolChoice: undefined
      }
  });

  // Try to parse the model's response as JSON
  try {
    const text = response.text || '';
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    }
    return [];
  } catch (e) {
    return [];
  }
}

// Example plugin structure for ElizaOS integration
export const groqLlamaPlugin: Plugin = {
  name: "groq-llama-freelancer-recommender",
  description: "Freelancer recommendation using Groq Llama-3.3-70b-versatile model.",
  actions: [
    {
        name: "recommendFreelancersWithLlama",
        description: "Recommend top freelancers for a task using Llama-3.3-70b-versatile.",
        handler: async (_runtime: any, message: any) => {
            // Extract task and freelancers from message or context
            const { task, freelancers } = message;
            return recommendFreelancersWithLlama(task, freelancers);
        },
        similes: [],
        examples: [],
        validate: function (runtime: IAgentRuntime, message: Memory, state?: State): Promise<boolean> {
            throw new Error("Function not implemented.");
        }
    }
  ]
};
