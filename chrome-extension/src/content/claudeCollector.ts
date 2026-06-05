/** Collect assistant message roots from Claude’s DOM (including open shadow roots). */

export function assistantTurnRoot(el: Element): Element {
  return (
    el.closest('[data-message-author-role="assistant"]') ??
    el.closest("[data-testid='conversation-turn']") ??
    el.closest("article") ??
    el.closest("div[class*='group/']") ??
    el
  );
}

function walkRoots(
  root: Document | ShadowRoot | Element,
  visit: (scope: Document | ShadowRoot | Element) => void
): void {
  visit(root);
  const nodes =
    "querySelectorAll" in root
      ? root.querySelectorAll("*")
      : [];
  nodes.forEach((el) => {
    if (el.shadowRoot) walkRoots(el.shadowRoot, visit);
  });
}

export function collectClaudeAssistantMessages(): Element[] {
  const found = new Set<Element>();
  const minLen = 25;

  const addIfAssistant = (el: Element) => {
    if (el.closest('[data-message-author-role="user"]')) return;
    if (el.closest("textarea, input, [contenteditable='true']")) return;
    if (el.closest("[data-testid='chat-input'], form")) return;
    const text = el.textContent?.trim() ?? "";
    if (text.length < minLen) return;
    found.add(assistantTurnRoot(el));
  };

  walkRoots(document, (scope) => {
    if (!("querySelectorAll" in scope)) return;

    scope
      .querySelectorAll('[data-message-author-role="assistant"]')
      .forEach((el) => addIfAssistant(el));

    scope
      .querySelectorAll(
        '[class*="font-claude"], [class*="standard-markdown"], [class*="prose"]'
      )
      .forEach((el) => addIfAssistant(el));
  });

  return [...found];
}
