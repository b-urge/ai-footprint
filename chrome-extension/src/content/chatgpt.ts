import { startAssistantObserver } from "./domObserver";

function collectChatGptAssistantMessages(): Element[] {
  const selectors = [
    '[data-message-author-role="assistant"]',
    'article[data-turn="assistant"]',
    ".agent-turn",
  ];
  const found = new Set<Element>();
  for (const sel of selectors) {
    document.querySelectorAll(sel).forEach((el) => found.add(el));
  }
  return [...found];
}

startAssistantObserver("chatgpt", collectChatGptAssistantMessages);
