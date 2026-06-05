import { LiveMetrics } from "@/components/LiveMetrics";
import { Comparisons } from "@/components/Comparisons";
import { MODELS } from "@/data/models";
import type { EnvironmentalImpact } from "@/utils/impactCalculator";
import { generateComparisons } from "@/utils/comparisons";

export interface ExtensionSessionData {
  tokens: number;
  waterMl: number;
  energyWh: number;
  co2Grams: number;
  messageCount: number;
  modelId: string;
}

interface ExtensionSessionProps {
  data: ExtensionSessionData;
}

export function ExtensionSession({ data }: ExtensionSessionProps) {
  const model =
    MODELS.find((m) => m.id === data.modelId) ?? MODELS[4];

  const impact: EnvironmentalImpact = {
    tokens: data.tokens,
    waterMl: data.waterMl,
    energyWh: data.energyWh,
    co2Grams: data.co2Grams,
    model,
  };

  const comparisons = generateComparisons(
    impact.waterMl,
    impact.energyWh,
    impact.co2Grams
  );

  return (
    <section className="px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-lg border border-accent-green/30 bg-accent-green/10 px-4 py-3">
          <p className="font-display text-xs font-semibold tracking-widest text-accent-green">
            CHROME EXTENSION · TODAY
          </p>
          <p className="mt-1 font-body text-sm font-light text-text-secondary">
            {data.messageCount > 0 ? (
              <>
                Passive tracking from ChatGPT / Claude — {data.messageCount}{" "}
                assistant {data.messageCount === 1 ? "reply" : "replies"},{" "}
                {data.tokens.toLocaleString()} tokens estimated today.
              </>
            ) : (
              <>
                Opened from the extension — no replies tracked yet today. Chat
                on Claude or ChatGPT, then open the extension popup again.
              </>
            )}{" "}
            Paste below to analyze one conversation in detail.
          </p>
        </div>
        {data.messageCount > 0 && (
          <>
            <LiveMetrics impact={impact} comparisons={comparisons} />
            <Comparisons comparisons={comparisons} tokenCount={data.tokens} />
          </>
        )}
      </div>
    </section>
  );
}
