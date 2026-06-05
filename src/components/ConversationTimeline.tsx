"use client";

import type { EnvironmentalImpact } from "@/utils/impactCalculator";
import {
  formatMicroImpact,
  messageImpact,
} from "@/utils/messageImpact";
import type { ParsedMessage } from "@/utils/tokenEstimator";

interface ConversationTimelineProps {
  messages: ParsedMessage[];
  impact: EnvironmentalImpact;
  modelId: string;
}

export function ConversationTimeline({
  messages,
  impact,
  modelId,
}: ConversationTimelineProps) {
  if (messages.length <= 1) return null;

  const runningTokens = messages.reduce((sum, m) => sum + m.tokenCount, 0);
  const progress =
    impact.tokens > 0
      ? Math.min(100, (runningTokens / impact.tokens) * 100)
      : 0;

  return (
    <section
      className="mt-10 px-4 sm:mt-12 sm:px-8"
      aria-label="Conversation breakdown"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display mb-6 text-xs font-semibold tracking-widest text-text-muted">
          CONVERSATION BREAKDOWN
        </h2>
        <ul className="space-y-4">
          {messages.map((msg, i) => {
            const micro = messageImpact(msg.tokenCount, modelId);
            const isUser = msg.role === "user";
            const isAssistant = msg.role === "assistant";

            return (
              <li
                key={`${msg.role}-${i}`}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg border px-4 py-3 sm:max-w-[70%] ${
                    isUser
                      ? "border-accent-green/20 bg-accent-green/10 backdrop-blur-sm"
                      : isAssistant
                        ? "border-border-subtle bg-bg-card/80 backdrop-blur-sm"
                        : "border-border-subtle bg-bg-secondary/80 backdrop-blur-sm"
                  }`}
                >
                  <p className="font-body line-clamp-3 text-sm text-text-primary">
                    {msg.content || "(empty)"}
                  </p>
                  <div
                    className={`mt-2 flex flex-wrap items-center gap-2 ${isUser ? "justify-end" : ""}`}
                  >
                    <span className="font-display rounded-full bg-bg-secondary px-2 py-0.5 text-xs text-text-secondary">
                      {msg.tokenCount} tk
                    </span>
                    <span className="font-body text-xs text-text-muted">
                      {formatMicroImpact(micro.waterMl)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-6">
          <div className="mb-1 flex justify-between font-body text-xs text-text-muted">
            <span>Running total</span>
            <span className="tabular-nums">
              {runningTokens.toLocaleString()} / {impact.tokens.toLocaleString()}{" "}
              tokens
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-900 to-accent-water transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
