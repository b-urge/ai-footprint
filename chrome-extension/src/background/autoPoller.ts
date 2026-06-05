import { recordText } from "./recordMessage";

type TabTrackState = { recordedLen: number };

const tabState = new Map<number, TabTrackState>();
const polling = new Set<number>();

function siteFromUrl(url: string): "claude" | "chatgpt" | null {
  if (url.includes("claude.ai")) return "claude";
  if (url.includes("chatgpt.com") || url.includes("chat.openai.com"))
    return "chatgpt";
  return null;
}

export async function pollTab(tabId: number, url: string): Promise<void> {
  const site = siteFromUrl(url);
  if (!site) return;
  if (polling.has(tabId)) return;
  polling.add(tabId);

  const previousLen = tabState.get(tabId)?.recordedLen ?? -1;

  try {
    let results: { result?: { len: number; chunk: string } }[];
    try {
      results = await chrome.scripting.executeScript({
        target: { tabId },
        func: (prevLen: number) => {
          const root =
            document.querySelector("main") ??
            document.querySelector('[role="main"]') ??
            document.body;
          const text = (root as HTMLElement).innerText ?? "";
          const len = text.length;
          if (prevLen < 0) return { len, chunk: "" };
          if (len <= prevLen) return { len, chunk: "" };
          return { len, chunk: text.slice(prevLen).trim() };
        },
        args: [previousLen],
      });
    } catch {
      tabState.delete(tabId);
      return;
    }

    const payload = results[0]?.result;
    if (!payload) return;

    if (!tabState.has(tabId)) {
      tabState.set(tabId, { recordedLen: payload.len });
      return;
    }

    const state = tabState.get(tabId)!;
    state.recordedLen = payload.len;

    if (payload.chunk.length < 12) return;

    await recordText(site, payload.chunk);
  } finally {
    polling.delete(tabId);
  }
}

async function pollAllAiTabs(): Promise<void> {
  const tabs = await chrome.tabs.query({
    url: [
      "https://claude.ai/*",
      "https://www.claude.ai/*",
      "https://chatgpt.com/*",
      "https://chat.openai.com/*",
    ],
  });
  for (const tab of tabs) {
    if (tab.id && tab.url) await pollTab(tab.id, tab.url);
  }
}

export function resetTabBaselines(): void {
  tabState.clear();
}

export function startAutoPoller(): void {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete" || !tab.url) return;
    if (!siteFromUrl(tab.url)) return;
    tabState.delete(tabId);
  });

  chrome.tabs.onRemoved.addListener((tabId) => {
    tabState.delete(tabId);
  });

  void pollAllAiTabs();
  setInterval(() => void pollAllAiTabs(), 1200);

  chrome.alarms.create("ai-footprint-poll", { periodInMinutes: 0.5 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "ai-footprint-poll") void pollAllAiTabs();
  });
}
