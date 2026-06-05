import { startSnapshotTracker } from "./snapshotTracker";

export function onExecute() {
  startSnapshotTracker("chatgpt");
}
