"use client";

import { useEffect, useRef } from "react";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";
import { getDecimalPlaces } from "@/utils/format";

const MAX_CHARS = 50_000;

interface ConversationInputProps {
  value: string;
  tokenCount: number;
  onChange: (text: string) => void;
  onTrySample: () => void;
  onClear: () => void;
}

export function ConversationInput({
  value,
  tokenCount,
  onChange,
  onTrySample,
  onClear,
}: ConversationInputProps) {
  const animatedTokens = useAnimatedValue(
    tokenCount,
    0.08,
    getDecimalPlaces(tokenCount)
  );
  const prevTokens = useRef(tokenCount);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prev = prevTokens.current;
    if (prev > 0 && Math.abs(tokenCount - prev) / prev > 0.1) {
      counterRef.current?.classList.add("scale-105");
      const t = setTimeout(
        () => counterRef.current?.classList.remove("scale-105"),
        200
      );
      prevTokens.current = tokenCount;
      return () => clearTimeout(t);
    }
    prevTokens.current = tokenCount;
  }, [tokenCount]);

  const charCount = value.length;
  const isLong = charCount >= MAX_CHARS;
  const isShort = tokenCount > 0 && tokenCount < 10;

  const handleChange = (text: string) => {
    onChange(text.slice(0, MAX_CHARS));
  };

  return (
    <section className="px-4 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <label htmlFor="conversation" className="sr-only">
          Paste an AI conversation
        </label>
        <textarea
          id="conversation"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste an AI conversation..."
          maxLength={MAX_CHARS}
          className="font-display min-h-[200px] w-full resize-y rounded-lg border border-border-subtle bg-bg-card/90 px-4 py-3 text-base text-text-primary backdrop-blur-sm outline-none transition-[border-color] duration-200 placeholder:font-light placeholder:text-text-muted focus:border-accent-green sm:text-sm"
          spellCheck={false}
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary sm:gap-4">
            <span
              ref={counterRef}
              className="font-display tabular-nums transition-transform duration-200"
            >
              ~ {animatedTokens.toLocaleString()} tokens
            </span>
            <span className="font-body tabular-nums">
              {charCount.toLocaleString()} chars
            </span>
            {isLong && (
              <span className="rounded-full bg-accent-energy/20 px-2 py-1 text-xs font-medium text-accent-energy">
                Max length reached (50k chars)
              </span>
            )}
            {isShort && (
              <span className="rounded-full bg-bg-secondary px-2 py-1 text-xs font-light text-text-muted">
                Very short — metrics still shown
              </span>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onTrySample}
              className="font-body flex min-h-11 min-w-[44px] flex-1 items-center justify-center rounded-lg border border-border-subtle bg-bg-card/90 px-4 py-2.5 text-sm font-medium text-text-primary backdrop-blur-sm transition-colors hover:bg-bg-card-hover sm:flex-initial"
            >
              Try Sample
            </button>
            <button
              type="button"
              onClick={onClear}
              className="font-body flex min-h-11 min-w-[44px] flex-1 items-center justify-center rounded-lg border border-border-subtle bg-bg-secondary/90 px-4 py-2.5 text-sm font-medium text-text-secondary backdrop-blur-sm transition-colors hover:text-text-primary sm:flex-initial"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
