export type ContentSite = "chatgpt" | "claude";

export interface AssistantMessagePayload {
  type: "ASSISTANT_MESSAGE";
  text: string;
  site: ContentSite;
  messageId: string;
}

export interface SyncChatPayload {
  type: "SYNC_CHAT";
  text: string;
  site: ContentSite;
}

export type ExtensionMessage = AssistantMessagePayload | SyncChatPayload;
