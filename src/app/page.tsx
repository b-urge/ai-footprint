"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ConversationInput } from "@/components/ConversationInput";
import { ModelSelector } from "@/components/ModelSelector";
import { LiveMetrics } from "@/components/LiveMetrics";
import { Comparisons } from "@/components/Comparisons";
import { ConversationTimeline } from "@/components/ConversationTimeline";
import {
  ExtensionSession,
  type ExtensionSessionData,
} from "@/components/ExtensionSession";
import { SAMPLE_CONVERSATION } from "@/data/sampleConversation";
import { useDebounce } from "@/hooks/useDebounce";
import { calculateImpact } from "@/utils/impactCalculator";
import { generateComparisons } from "@/utils/comparisons";
import {
  estimateTokens,
  parseConversation,
} from "@/utils/tokenEstimator";

function parseExtensionParams(
  params: URLSearchParams
): ExtensionSessionData | null {
  if (params.get("from") !== "extension") return null;
  const messageCount = Number(params.get("messages") ?? 0);
  if (messageCount < 1) return null;
  return {
    tokens: Number(params.get("tokens") ?? 0),
    waterMl: Number(params.get("water") ?? 0),
    energyWh: Number(params.get("energy") ?? 0),
    co2Grams: Number(params.get("co2") ?? 0),
    messageCount,
    modelId: params.get("model") ?? "claude-sonnet",
  };
}

function HomeContent() {
  const searchParams = useSearchParams();
  const extensionData = useMemo(
    () => parseExtensionParams(searchParams),
    [searchParams]
  );

  const [conversationText, setConversationText] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("claude-sonnet");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (extensionData) {
      setSelectedModelId(extensionData.modelId);
      setConversationText("");
    } else {
      setConversationText(SAMPLE_CONVERSATION);
    }
  }, [extensionData]);

  const debouncedText = useDebounce(conversationText, 200);

  const tokenCount = useMemo(
    () => estimateTokens(debouncedText),
    [debouncedText]
  );

  const impact = useMemo(
    () => calculateImpact(tokenCount, selectedModelId),
    [tokenCount, selectedModelId]
  );

  const comparisons = useMemo(
    () =>
      generateComparisons(impact.waterMl, impact.energyWh, impact.co2Grams),
    [impact.waterMl, impact.energyWh, impact.co2Grams]
  );

  const parsedMessages = useMemo(
    () => parseConversation(debouncedText),
    [debouncedText]
  );

  const showPasteAnalysis = conversationText.trim().length > 0;

  if (!hydrated) return null;

  return (
    <>
      <BackgroundEffects />
      <main className="relative z-10 min-h-screen pb-8">
        <Header />
        {extensionData && <ExtensionSession data={extensionData} />}
        <ConversationInput
          value={conversationText}
          tokenCount={tokenCount}
          onChange={setConversationText}
          onTrySample={() => setConversationText(SAMPLE_CONVERSATION)}
          onClear={() => setConversationText("")}
        />
        <ModelSelector
          selectedModelId={selectedModelId}
          onChange={setSelectedModelId}
        />
        {showPasteAnalysis && (
          <>
            <LiveMetrics impact={impact} comparisons={comparisons} />
            <Comparisons comparisons={comparisons} tokenCount={tokenCount} />
            <ConversationTimeline
              messages={parsedMessages}
              impact={impact}
              modelId={selectedModelId}
            />
          </>
        )}
        {!showPasteAnalysis && !extensionData && (
          <LiveMetrics impact={impact} comparisons={comparisons} />
        )}
        {!showPasteAnalysis && !extensionData && (
          <Comparisons comparisons={comparisons} tokenCount={tokenCount} />
        )}
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
