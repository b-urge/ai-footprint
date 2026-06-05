import { clearSeenTurns } from "./seenTurns";

export interface DailyStats {
  date: string;
  tokens: number;
  waterMl: number;
  energyWh: number;
  co2Grams: number;
  messageCount: number;
}

export interface Settings {
  defaultModelId: string;
}

export interface LifetimeStats {
  totalTokens: number;
  totalWaterMl: number;
  totalMessages: number;
}

const DEFAULT_SETTINGS: Settings = { defaultModelId: "claude-sonnet" };

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dailyStorageKey(date: string): string {
  return `daily:${date}`;
}

export async function getSettings(): Promise<Settings> {
  const { settings } = await chrome.storage.local.get("settings");
  return { ...DEFAULT_SETTINGS, ...(settings as Settings | undefined) };
}

export async function setSettings(settings: Settings): Promise<void> {
  await chrome.storage.local.set({ settings });
}

export async function getTodayStats(): Promise<DailyStats> {
  const date = todayKey();
  const key = dailyStorageKey(date);
  const data = await chrome.storage.local.get(key);
  const existing = data[key] as DailyStats | undefined;
  if (existing?.date === date) return existing;
  return {
    date,
    tokens: 0,
    waterMl: 0,
    energyWh: 0,
    co2Grams: 0,
    messageCount: 0,
  };
}

export async function addMessageImpact(
  tokens: number,
  waterMl: number,
  energyWh: number,
  co2Grams: number
): Promise<DailyStats> {
  const current = await getTodayStats();
  const updated: DailyStats = {
    ...current,
    tokens: current.tokens + tokens,
    waterMl: current.waterMl + waterMl,
    energyWh: current.energyWh + energyWh,
    co2Grams: current.co2Grams + co2Grams,
    messageCount: current.messageCount + 1,
  };
  await chrome.storage.local.set({ [dailyStorageKey(updated.date)]: updated });

  const { lifetime } = await chrome.storage.local.get("lifetime");
  const lt = (lifetime as LifetimeStats | undefined) ?? {
    totalTokens: 0,
    totalWaterMl: 0,
    totalMessages: 0,
  };
  await chrome.storage.local.set({
    lifetime: {
      totalTokens: lt.totalTokens + tokens,
      totalWaterMl: lt.totalWaterMl + waterMl,
      totalMessages: lt.totalMessages + 1,
    },
  });

  return updated;
}

export async function resetTodayStats(): Promise<DailyStats> {
  const date = todayKey();
  const empty: DailyStats = {
    date,
    tokens: 0,
    waterMl: 0,
    energyWh: 0,
    co2Grams: 0,
    messageCount: 0,
  };
  await chrome.storage.local.set({ [dailyStorageKey(date)]: empty });
  await clearSeenTurns();
  return empty;
}
