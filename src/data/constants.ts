/** Environmental benchmarks — sources cited in Footer / README */
export const ENV_CONSTANTS = {
  // Per 1000 tokens (baseline: GPT-4 class model)
  waterMl: 3.5,
  energyWh: 0.4,
  co2Grams: 0.2,

  // Comparison anchors
  toiletFlushMl: 6000,
  showerPerMinuteMl: 7500,
  glassOfWaterMl: 250,
  bottledWaterMl: 500,
  phoneChargeWh: 12,
  lightbulbHourWh: 10,
  laptopHourWh: 50,
  googleSearchWh: 0.3,
  netflixHourWh: 36,
  carPerMileG: 400,
  breathG: 200,
  balloonG: 14,
  treeAbsorbDailyG: 22000,
} as const;
