export type ContentSite = "chatgpt" | "claude";

export interface AssistantMessagePayload {
  type: "ASSISTANT_MESSAGE";
  text: string;
  site: ContentSite;
  messageId: string;
}

export type ExtensionMessage = AssistantMessagePayload;
