import type { ContentSite } from "../messages";

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

/**
 * Auto-tracks new chat text while Claude/ChatGPT streams a reply.
 * Counts incremental slices so the badge climbs during generation, not only at the end.
 */
export function startSnapshotTracker(site: ContentSite): void {
  let recordedLen = 0;
  let ready = false;
  let flushTimer: ReturnType<typeof setTimeout> | null = null;
  let lastFlushAt = 0;
  let lastObservedLen = 0;

  const initBaseline = () => {
    recordedLen = getConversationText().length;
    lastObservedLen = recordedLen;
    ready = true;
  };

  setTimeout(initBaseline, 800);

  const flush = async () => {
    if (!ready) return;
    const now = Date.now();
    if (now - lastFlushAt < 900) return;

    const full = getConversationText();
    if (full.length <= recordedLen) return;

    const chunk = full.slice(recordedLen).trim();
    if (chunk.length < 12) return;

    const messageId = `${site}:inc:${recordedLen}:${full.length}`;
    try {
      await sendMessage(site, chunk, messageId);
      recordedLen = full.length;
      lastFlushAt = now;
    } catch {
      // Service worker asleep — heartbeat will retry
    }
  };

  const scheduleFlush = (ms = 500) => {
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(() => void flush(), ms);
  };

  setInterval(() => {
    if (!ready) return;
    const len = getConversationText().length;
    const growing = len > lastObservedLen;
    lastObservedLen = len;

    if (len <= recordedLen + 12) return;

    if (growing) {
      void flush();
    } else {
      scheduleFlush(400);
    }
  }, 1200);

  const observer = new MutationObserver(() => {
    if (!ready) return;
    const len = getConversationText().length;
    if (len > recordedLen + 8) scheduleFlush(450);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}
