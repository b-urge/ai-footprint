import type { ContentSite } from "../messages";

export function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

/** Keep only the outermost elements — drop nested duplicates. */
export function outermostOnly(candidates: Element[]): Element[] {
  const unique = [...new Set(candidates)];
  return unique.filter(
    (el) => !unique.some((other) => other !== el && other.contains(el))
  );
}

export function turnIdForElement(el: Element, site: ContentSite): string {
  const fromAttr =
    el.getAttribute("data-message-id") ??
    el.getAttribute("data-id") ??
    el.querySelector("[data-message-id]")?.getAttribute("data-message-id");
  if (fromAttr) return `${site}:msg:${fromAttr}`;

  const text = el.textContent?.trim() ?? "";
  const path = `${location.hostname}${location.pathname}`;
  return `${site}:hash:${path}:${simpleHash(`${text.length}:${text.slice(0, 1200)}`)}`;
}

export function isStreamingTurn(el: Element): boolean {
  if (el.getAttribute("data-is-streaming") === "true") return true;
  return el.querySelector('[data-is-streaming="true"]') !== null;
}

function walkShadowRoots(
  root: Document | ShadowRoot | Element,
  visit: (scope: Document | ShadowRoot | Element) => void
): void {
  visit(root);
  if (!("querySelectorAll" in root)) return;
  root.querySelectorAll("*").forEach((el) => {
    if (el.shadowRoot) walkShadowRoots(el.shadowRoot, visit);
  });
}

/** One element per assistant turn — role attribute only, no inner prose nodes. */
export function collectAssistantTurns(): Element[] {
  const found: Element[] = [];

  const addTurn = (el: Element) => {
    if (el.closest('[data-message-author-role="user"]')) return;
    if (el.closest("textarea, input, [contenteditable='true'], form")) return;
    found.push(el);
  };

  walkShadowRoots(document, (scope) => {
    if (!("querySelectorAll" in scope)) return;
    scope
      .querySelectorAll('[data-message-author-role="assistant"]')
      .forEach(addTurn);
  });

  document
    .querySelectorAll("article[data-turn='assistant'], .agent-turn")
    .forEach(addTurn);

  return outermostOnly(found);
}
