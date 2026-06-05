import { startAssistantObserver } from "./domObserver";
import { collectClaudeAssistantMessages } from "./claudeCollector";

startAssistantObserver("claude", collectClaudeAssistantMessages);
