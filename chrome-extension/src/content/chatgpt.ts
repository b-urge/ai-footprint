import { startAssistantObserver } from "./domObserver";
import { collectChatGptTurns } from "./turnCollector";

startAssistantObserver("chatgpt", collectChatGptTurns);
