import { ENV_CONSTANTS } from "@/data/constants";
import { MODELS } from "@/data/models";

export function messageImpact(
  tokenCount: number,
  modelId: string
): { waterMl: number; energyWh: number; co2Grams: number } {
  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const k = tokenCount / 1000;
  return {
    waterMl: k * ENV_CONSTANTS.waterMl * model.multiplier,
    energyWh: k * ENV_CONSTANTS.energyWh * model.multiplier,
    co2Grams: k * ENV_CONSTANTS.co2Grams * model.multiplier,
  };
}

export function formatMicroImpact(waterMl: number): string {
  if (waterMl < 0.01) return "<0.01 mL water";
  if (waterMl < 1) return `~${waterMl.toFixed(2)} mL water`;
  return `~${waterMl.toFixed(1)} mL water`;
}
