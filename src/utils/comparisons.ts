import { ENV_CONSTANTS } from "@/data/constants";

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
    {
      id: "toilet",
      value: waterMl / ENV_CONSTANTS.toiletFlushMl,
      unit: "flushes",
      label: "toilet flushes",
      icon: "🚽",
      category: "water",
    },
    {
      id: "shower",
      value: (waterMl / ENV_CONSTANTS.showerPerMinuteMl) * 60,
      unit: "seconds",
      label: "seconds of showering",
      icon: "🚿",
      category: "water",
    },
    {
      id: "glass",
      value: waterMl / ENV_CONSTANTS.glassOfWaterMl,
      unit: "glasses",
      label: "glasses of water",
      icon: "🥛",
      category: "water",
    },
    {
      id: "bottle",
      value: waterMl / ENV_CONSTANTS.bottledWaterMl,
      unit: "bottles",
      label: "water bottles",
      icon: "🧴",
      category: "water",
    },
    {
      id: "phone",
      value: energyWh / ENV_CONSTANTS.phoneChargeWh,
      unit: "charges",
      label: "phone charges",
      icon: "🔋",
      category: "energy",
    },
    {
      id: "lightbulb",
      value: energyWh / ENV_CONSTANTS.lightbulbHourWh,
      unit: "hours",
      label: "hours of LED bulb",
      icon: "💡",
      category: "energy",
    },
    {
      id: "google",
      value: energyWh / ENV_CONSTANTS.googleSearchWh,
      unit: "searches",
      label: "Google searches",
      icon: "🔍",
      category: "energy",
    },
    {
      id: "netflix",
      value: energyWh / ENV_CONSTANTS.netflixHourWh,
      unit: "hours",
      label: "hours of Netflix",
      icon: "📺",
      category: "energy",
    },
    {
      id: "driving",
      value: co2Grams / ENV_CONSTANTS.carPerMileG,
      unit: "miles",
      label: "miles driven",
      icon: "🚗",
      category: "co2",
    },
    {
      id: "breath",
      value: co2Grams / ENV_CONSTANTS.breathG,
      unit: "breaths",
      label: "human breaths",
      icon: "🌬️",
      category: "co2",
    },
    {
      id: "balloon",
      value: co2Grams / ENV_CONSTANTS.balloonG,
      unit: "balloons",
      label: "balloons of CO2",
      icon: "🎈",
      category: "co2",
    },
    {
      id: "tree",
      value: co2Grams / ENV_CONSTANTS.treeAbsorbDailyG,
      unit: "tree-days",
      label: "tree-days to offset",
      icon: "🌳",
      category: "co2",
    },
  ];
  return all.filter((c) => c.value >= 0.01);
}
