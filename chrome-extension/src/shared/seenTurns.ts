const SEEN_TURNS_KEY = "seenTurns";
const MAX_SEEN = 2000;

export async function hasSeenTurn(turnId: string): Promise<boolean> {
  const data = await chrome.storage.local.get(SEEN_TURNS_KEY);
  const map = (data[SEEN_TURNS_KEY] as Record<string, number>) ?? {};
  return turnId in map;
}

export async function markTurnSeen(turnId: string): Promise<void> {
  const data = await chrome.storage.local.get(SEEN_TURNS_KEY);
  const map = { ...((data[SEEN_TURNS_KEY] as Record<string, number>) ?? {}) };
  map[turnId] = Date.now();

  const ids = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const pruned = Object.fromEntries(ids.slice(0, MAX_SEEN));
  await chrome.storage.local.set({ [SEEN_TURNS_KEY]: pruned });
}

export async function clearSeenTurns(): Promise<void> {
  await chrome.storage.local.remove(SEEN_TURNS_KEY);
}
