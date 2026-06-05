export function estimateTokens(text: string): number {
  if (!text.trim()) return 0;
  const codeFence = /```[\s\S]*?```/g;
  const codeBlocks = text.match(codeFence) || [];
  const proseText = text.replace(codeFence, "");
  const codeChars = codeBlocks.reduce((sum, b) => sum + b.length, 0);
  return Math.ceil(codeChars / 3) + Math.ceil(proseText.length / 4);
}
