import { useEffect, useState } from "react";
import { MODELS } from "../shared/models";
import { getSettings, setSettings } from "../shared/storage";

export function Options() {
  const [modelId, setModelId] = useState("claude-sonnet");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void getSettings().then((s) => setModelId(s.defaultModelId));
  }, []);

  const save = async () => {
    await setSettings({ defaultModelId: modelId });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="popup" style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}>
      <h1 className="popup-title" style={{ fontSize: 14, marginBottom: 8 }}>
        AI FOOTPRINT SETTINGS
      </h1>
      <p className="popup-date" style={{ marginBottom: 20 }}>
        Fallback model when site-specific defaults are unavailable. ChatGPT uses
        GPT-4o; Claude uses Claude Sonnet.
      </p>
      <label
        htmlFor="model"
        style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)" }}
      >
        Default model
      </label>
      <select
        id="model"
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          marginBottom: 16,
        }}
      >
        {MODELS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name} ({m.provider}) — {m.multiplier}x
          </option>
        ))}
      </select>
      <button type="button" className="btn-primary" onClick={() => void save()}>
        {saved ? "Saved" : "Save settings"}
      </button>
      <p className="popup-date" style={{ marginTop: 24 }}>
        All data stays in chrome.storage.local on this device. Nothing is sent
        to a server.
      </p>
    </div>
  );
}
