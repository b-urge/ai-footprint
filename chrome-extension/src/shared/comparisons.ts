import { ENV_CONSTANTS } from "./constants";

export interface Comparison {
  id: string;
  value: number;
  unit: string;
  label: string;
  icon: string;
  category: "water" | "energy" | "co2";
}

export function generateComparisons(
  waterMl: number,
  energyWh: number,
  co2Grams: number
): Comparison[] {
  const all: Comparison[] = [
    { id: "glass", value: waterMl / ENV_CONSTANTS.glassOfWaterMl, unit: "glasses", label: "glasses of water", icon: "🥛", category: "water" },
    { id: "phone", value: energyWh / ENV_CONSTANTS.phoneChargeWh, unit: "charges", label: "phone charges", icon: "🔋", category: "energy" },
    { id: "google", value: energyWh / ENV_CONSTANTS.googleSearchWh, unit: "searches", label: "Google searches", icon: "🔍", category: "energy" },
    { id: "driving", value: co2Grams / ENV_CONSTANTS.carPerMileG, unit: "miles", label: "miles driven", icon: "🚗", category: "co2" },
    { id: "breath", value: co2Grams / ENV_CONSTANTS.breathG, unit: "breaths", label: "human breaths", icon: "🌬️", category: "co2" },
  ];
  return all.filter((c) => c.value >= 0.01).sort((a, b) => b.value - a.value);
}
