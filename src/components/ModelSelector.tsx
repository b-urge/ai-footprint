"use client";

import { MODELS } from "@/data/models";

interface ModelSelectorProps {
  selectedModelId: string;
  onChange: (modelId: string) => void;
  className?: string;
}

export function ModelSelector({
  selectedModelId,
  onChange,
  className = "",
}: ModelSelectorProps) {
  const selected = MODELS.find((m) => m.id === selectedModelId) ?? MODELS[0];

  return (
    <section className={`mt-4 px-4 sm:px-8 ${className}`.trim()}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <label
          htmlFor="model-select"
          className="font-body shrink-0 text-sm font-medium text-text-secondary"
        >
          Model:
        </label>
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:max-w-lg sm:flex-row sm:items-center">
          <select
            id="model-select"
            value={selectedModelId}
            onChange={(e) => onChange(e.target.value)}
            className="font-body min-h-11 w-full cursor-pointer appearance-none rounded-lg border border-border-subtle bg-bg-card/90 py-2 pl-3 pr-10 text-sm font-medium text-text-primary backdrop-blur-sm outline-none transition-colors hover:bg-bg-card-hover focus:border-accent-green"
          >
            {MODELS.map((model) => (
              <option key={model.id} value={model.id} className="bg-bg-card">
                {model.name} — {model.provider}
              </option>
            ))}
          </select>
          <span className="font-display shrink-0 rounded-full bg-bg-secondary px-2.5 py-1 text-xs font-medium text-text-secondary">
            {selected.multiplier}x
          </span>
        </div>
      </div>
    </section>
  );
}
