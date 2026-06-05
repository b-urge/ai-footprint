import type { ContentSite } from "../messages";

const turnIdByElement = new WeakMap<Element, string>();

export function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

export function outermostOnly(candidates: Element[]): Element[] {
  const unique = [...new Set(candidates)];
  return unique.filter(
    (el) => !unique.some((other) => other !== el && other.contains(el))
  );
}

export function turnIdForElement(el: Element, site: ContentSite): string {
  const cached = turnIdByElement.get(el);
  if (cached) return cached;

  const fromAttr =
    el.getAttribute("data-message-id") ??
    el.getAttribute("data-id") ??
    el.querySelector("[data-message-id]")?.getAttribute("data-message-id");

  const text = el.textContent?.trim() ?? "";
  const path = `${location.hostname}${location.pathname}`;
  const id =
    fromAttr != null
      ? `${site}:msg:${fromAttr}`
      : `${site}:hash:${path}:${simpleHash(text.slice(0, 280))}`;

  turnIdByElement.set(el, id);
  return id;
}

/** Only the turn node itself — not stale streaming flags on descendants. */
export function isStreamingTurn(el: Element): boolean {
  return el.getAttribute("data-is-streaming") === "true";
}

function walkShadowRoots(
  root: Document | ShadowRoot | Element,
  visit: (scope: Document | ShadowRoot | Element) => void
): void {
  visit(root);
  if (!("querySelectorAll" in root)) return;
  root.querySelectorAll("*").forEach((node) => {
    if (node.shadowRoot) walkShadowRoots(node.shadowRoot, visit);
  });
}

function isUserOrInput(el: Element): boolean {
  return (
    !!el.closest('[data-message-author-role="user"]') ||
    !!el.closest("textarea, input, [contenteditable='true'], form")
  );
}

export function collectChatGptTurns(): Element[] {
  const found: Element[] = [];
  walkShadowRoots(document, (scope) => {
    if (!("querySelectorAll" in scope)) return;
    scope
      .querySelectorAll('[data-message-author-role="assistant"]')
      .forEach((el) => {
        if (!isUserOrInput(el)) found.push(el);
      });
  });
  document
    .querySelectorAll("article[data-turn='assistant'], .agent-turn")
    .forEach((el) => {
      if (!isUserOrInput(el)) found.push(el);
    });
  return outermostOnly(found);
}

export function collectClaudeTurns(): Element[] {
  const found: Element[] = [];

  walkShadowRoots(document, (scope) => {
    if (!("querySelectorAll" in scope)) return;
    scope
      .querySelectorAll('[data-message-author-role="assistant"]')
      .forEach((el) => {
        if (!isUserOrInput(el)) found.push(el);
      });
  });

  document
    .querySelectorAll(
      '.font-claude-message, [class*="font-claude"], [class*="standard-markdown"]'
    )
    .forEach((el) => {
      if (isUserOrInput(el)) return;
      const turn =
        el.closest('[data-message-author-role="assistant"]') ??
        el.closest("[data-testid='conversation-turn']") ??
        el.closest("article") ??
        el.closest('div[class*="group/"]') ??
        el;
      if ((turn.textContent?.trim().length ?? 0) >= 20) found.push(turn);
    });

  return outermostOnly(found);
}
