import type { ContentSite } from "../messages";
import { simpleHash } from "./turnCollector";

function getConversationText(): string {
  const root =
    document.querySelector("main") ??
    document.querySelector('[role="main"]') ??
    document.body;
  return (root as HTMLElement).innerText?.trim() ?? "";
}

function sendMessage(
  site: ContentSite,
  text: string,
  messageId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        { type: "ASSISTANT_MESSAGE", text, site, messageId },
        () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve();
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

/** Tracks new text appearing in the chat — works when DOM role attributes are missing. */
export function startClaudeSnapshotTracker(site: ContentSite): void {
  let recordedLen = 0;
  let ready = false;
  let flushTimer: ReturnType<typeof setTimeout> | null = null;

  const initBaseline = () => {
    recordedLen = getConversationText().length;
    ready = true;
  };

  setTimeout(initBaseline, 2000);

  const flush = async () => {
    if (!ready) return;
    const full = getConversationText();
    if (full.length <= recordedLen) return;

    const chunk = full.slice(recordedLen).trim();
    if (chunk.length < 20) return;

    const messageId = `${site}:snap:${simpleHash(chunk.slice(0, 500))}:${chunk.length}`;
    try {
      await sendMessage(site, chunk, messageId);
      recordedLen = full.length;
    } catch {
      // Service worker waking up — retry on next flush
    }
  };

  const scheduleFlush = () => {
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(() => void flush(), 1600);
  };

  setInterval(() => {
    if (!ready) return;
    const len = getConversationText().length;
    if (len > recordedLen + 15) scheduleFlush();
  }, 700);

  const observer = new MutationObserver(scheduleFlush);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}
