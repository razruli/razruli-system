import { groq } from "@ai-sdk/groq";

/**
 * Model provider using Groq
 * Using: Llama 3.1 8B Instant (free tier, fast, reliable)
 *
 * Note: Vercel AI Gateway requires credit card verification for free credits
 * Switching to Groq for now (no payment required)
 */

export type ModelProvider = "groq";

interface ModelConfig {
  provider: ModelProvider;
  modelId: string;
}

/**
 * Model type that can be returned from getModel
 */
type LanguageModel = ReturnType<typeof groq>;

/**
 * Get the appropriate model
 * Uses Groq (no credit card verification required)
 */
export async function getModel(): Promise<{
  model: LanguageModel;
  provider: ModelProvider;
  modelId: string;
}> {
  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    throw new Error(
      "GROQ_API_KEY not configured. " +
        "Set GROQ_API_KEY in .env.local. Get a free key at https://console.groq.com/keys",
    );
  }

  console.info("[ModelProvider] Using Groq Llama 3.1 8B Instant");
  return {
    model: groq("llama-3.1-8b-instant"),
    provider: "groq",
    modelId: "llama-3.1-8b-instant",
  };
}

/**
 * Get model config without instantiating the model
 * Useful for logging/debugging
 */
export function getModelConfig(): ModelConfig {
  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    throw new Error(
      "GROQ_API_KEY not configured. Set GROQ_API_KEY in .env.local",
    );
  }

  return { provider: "groq", modelId: "llama-3.1-8b-instant" };
}
