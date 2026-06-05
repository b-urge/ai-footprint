const CODE_FENCE_REGEX = /```[\s\S]*?```/g;

export function estimateTokens(text: string): number {
  if (!text.trim()) return 0;
  const codeBlocks = text.match(CODE_FENCE_REGEX) || [];
  const proseText = text.replace(CODE_FENCE_REGEX, "");
  const codeChars = codeBlocks.reduce((sum, b) => sum + b.length, 0);
  return Math.ceil(codeChars / 3) + Math.ceil(proseText.length / 4);
}

export interface ParsedMessage {
  role: "user" | "assistant" | "system" | "unknown";
  content: string;
  tokenCount: number;
}

export function parseConversation(text: string): ParsedMessage[] {
  const splitRegex =
    /^(?=(?:User|Human|Me|Q|Assistant|AI|Claude|ChatGPT|GPT|Gemini|A|System):)/im;
  const segments = text.split(splitRegex).filter((s) => s.trim());

  if (segments.length <= 1) {
    return [
      {
        role: "unknown",
        content: text.trim(),
        tokenCount: estimateTokens(text),
      },
    ];
  }

  const ROLE_PATTERNS = [
    { regex: /^(User|Human|Me|Q):\s*/im, role: "user" as const },
    {
      regex: /^(Assistant|AI|Claude|ChatGPT|GPT|Gemini|A):\s*/im,
      role: "assistant" as const,
    },
    { regex: /^(System):\s*/im, role: "system" as const },
  ];

  return segments.map((seg) => {
    let role: ParsedMessage["role"] = "unknown";
    let content = seg.trim();
    for (const p of ROLE_PATTERNS) {
      if (p.regex.test(content)) {
        role = p.role;
        content = content.replace(p.regex, "").trim();
        break;
      }
    }
    return { role, content, tokenCount: estimateTokens(content) };
  });
}
