import { startAssistantObserver } from "./domObserver";
import { collectAssistantTurns } from "./turnCollector";

startAssistantObserver("claude", collectAssistantTurns);
