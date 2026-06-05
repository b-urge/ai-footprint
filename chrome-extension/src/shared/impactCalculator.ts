import { ENV_CONSTANTS } from "./constants";
import { MODELS, type ModelProfile } from "./models";

export interface EnvironmentalImpact {
  tokens: number;
  waterMl: number;
  energyWh: number;
  co2Grams: number;
  model: ModelProfile;
}

export function calculateImpact(
  tokenCount: number,
  modelId: string
): EnvironmentalImpact {
  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const kTokens = tokenCount / 1000;
  return {
    tokens: tokenCount,
    waterMl: kTokens * ENV_CONSTANTS.waterMl * model.multiplier,
    energyWh: kTokens * ENV_CONSTANTS.energyWh * model.multiplier,
    co2Grams: kTokens * ENV_CONSTANTS.co2Grams * model.multiplier,
    model,
  };
}
