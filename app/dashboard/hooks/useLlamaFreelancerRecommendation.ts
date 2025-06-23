import { useState } from "react";
import { LlamaTask, LlamaFreelancer, recommendFreelancersWithLlama } from "@/lib/groq-llama-recommender";

export function useLlamaFreelancerRecommendation() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (task: LlamaTask, freelancers: LlamaFreelancer[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recommendFreelancersWithLlama(task, freelancers);
      setRecommendations(result);
    } catch (e) {
      setError("Failed to get recommendations");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return { recommendations, loading, error, getRecommendations };
}
