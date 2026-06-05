export interface ModelProfile {
  id: string;
  name: string;
  provider: string;
  multiplier: number;
  notes: string;
}

export const MODELS: ModelProfile[] = [
  { id: "gpt-4", name: "GPT-4 / GPT-4 Turbo", provider: "OpenAI", multiplier: 1.0, notes: "" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", multiplier: 0.6, notes: "" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", multiplier: 0.15, notes: "" },
  { id: "claude-opus", name: "Claude Opus", provider: "Anthropic", multiplier: 1.1, notes: "" },
  { id: "claude-sonnet", name: "Claude Sonnet", provider: "Anthropic", multiplier: 0.4, notes: "" },
  { id: "claude-haiku", name: "Claude Haiku", provider: "Anthropic", multiplier: 0.1, notes: "" },
  { id: "gemini-pro", name: "Gemini 1.5 Pro", provider: "Google", multiplier: 0.8, notes: "" },
  { id: "gemini-flash", name: "Gemini 1.5 Flash", provider: "Google", multiplier: 0.2, notes: "" },
  { id: "llama-70b", name: "Llama 3 70B", provider: "Meta", multiplier: 0.5, notes: "" },
];

export const SITE_DEFAULT_MODEL: Record<string, string> = {
  chatgpt: "gpt-4o",
  claude: "claude-sonnet",
};
