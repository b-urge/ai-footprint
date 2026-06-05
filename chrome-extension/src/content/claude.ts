import { startAssistantObserver } from "./domObserver";
import { collectClaudeTurns } from "./turnCollector";

startAssistantObserver("claude", collectClaudeTurns);
