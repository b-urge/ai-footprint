export interface ModelProfile {
  id: string;
  name: string;
  provider: string;
  multiplier: number;
  notes: string;
}

export const MODELS: ModelProfile[] = [
  {
    id: "gpt-4",
    name: "GPT-4 / GPT-4 Turbo",
    provider: "OpenAI",
    multiplier: 1.0,
    notes: "Baseline. ~1.7T params (est).",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    multiplier: 0.6,
    notes: "Optimized variant.",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    multiplier: 0.15,
    notes: "Small model, low footprint.",
  },
  {
    id: "claude-opus",
    name: "Claude Opus",
    provider: "Anthropic",
    multiplier: 1.1,
    notes: "Large model. AWS us-east.",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    provider: "Anthropic",
    multiplier: 0.4,
    notes: "Mid-tier balanced.",
  },
  {
    id: "claude-haiku",
    name: "Claude Haiku",
    provider: "Anthropic",
    multiplier: 0.1,
    notes: "Lightweight. Minimal cost.",
  },
  {
    id: "gemini-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    multiplier: 0.8,
    notes: "High renewable mix.",
  },
  {
    id: "gemini-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    multiplier: 0.2,
    notes: "Distilled. Very efficient.",
  },
  {
    id: "llama-70b",
    name: "Llama 3 70B (hosted)",
    provider: "Meta",
    multiplier: 0.5,
    notes: "Varies by host.",
  },
];
