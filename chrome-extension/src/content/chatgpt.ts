import { startAssistantObserver } from "./domObserver";
import { collectAssistantTurns } from "./turnCollector";

startAssistantObserver("chatgpt", collectAssistantTurns);
