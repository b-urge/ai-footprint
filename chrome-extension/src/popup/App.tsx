import { useEffect, useMemo, useState } from "react";
import { generateComparisons } from "../shared/comparisons";
import { buildDashboardUrl } from "../shared/dashboardUrl";
import { getTodayStats, resetTodayStats, type DailyStats } from "../shared/storage";

function formatNum(n: number, dp = 1): string {
  if (n < 1) return n.toFixed(2);
  if (n < 100) return n.toFixed(dp);
  return Math.round(n).toLocaleString();
}

export function App() {
  const [stats, setStats] = useState<DailyStats | null>(null);

  const load = () => {
    void getTodayStats().then(setStats);
  };

  useEffect(() => {
    load();
    const onChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string
    ) => {
      if (area !== "local") return;
      if (Object.keys(changes).some((k) => k.startsWith("daily:"))) load();
    };
    chrome.storage.onChanged.addListener(onChange);
    return () => chrome.storage.onChanged.removeListener(onChange);
  }, []);

  const comparisons = useMemo(() => {
    if (!stats) return [];
    return generateComparisons(stats.waterMl, stats.energyWh, stats.co2Grams).slice(
      0,
      3
    );
  }, [stats]);

  const dateLabel = stats?.date ?? new Date().toISOString().slice(0, 10);
  const dashboardUrl = buildDashboardUrl(stats);

  return (
    <div className="popup">
      <div className="popup-header">
        <span className="live-dot" aria-hidden />
        <span className="popup-title">AI CARBON FOOTPRINT</span>
      </div>
      <p className="popup-date">Today · {dateLabel}</p>

      {!stats || stats.messageCount === 0 ? (
        <p className="empty">
          Chat on ChatGPT or Claude. Each <strong>completed assistant reply</strong>{" "}
          adds to today&apos;s total. The toolbar badge shows water (mL); small
          replies may show <strong>&lt;1</strong>.
        </p>
      ) : (
        <>
          <div className="metrics">
            <div className="metric-card">
              <div className="metric-label water">WATER</div>
              <div className="metric-value">{formatNum(stats.waterMl)}</div>
              <div className="metric-unit">mL</div>
            </div>
            <div className="metric-card">
              <div className="metric-label energy">ENERGY</div>
              <div className="metric-value">{formatNum(stats.energyWh)}</div>
              <div className="metric-unit">Wh</div>
            </div>
            <div className="metric-card">
              <div className="metric-label co2">CO₂</div>
              <div className="metric-value">{formatNum(stats.co2Grams)}</div>
              <div className="metric-unit">g</div>
            </div>
          </div>

          <div className="meta">
            <span>{stats.messageCount} assistant replies</span>
            <span>{stats.tokens.toLocaleString()} tokens</span>
          </div>

          {comparisons.length > 0 && (
            <div className="comparisons">
              <h3>EQUIVALENT TO</h3>
              {comparisons.map((c) => (
                <div key={c.id} className="comparison-row">
                  <span>
                    {c.icon} {c.label}
                  </span>
                  <strong>
                    {c.value < 1 ? c.value.toFixed(2) : c.value.toFixed(1)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <p className="popup-date" style={{ marginBottom: 10, lineHeight: 1.4 }}>
        Tracking lives in this popup. The website is for paste-and-analyze — it
        opens with <strong>today&apos;s extension totals</strong> when you have
        data.
      </p>

      <div className="actions">
        <a
          className="btn-primary"
          href={dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open dashboard (today&apos;s stats)
        </a>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          Model &amp; settings
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            void resetTodayStats().then(setStats);
          }}
        >
          Reset today (demo)
        </button>
      </div>
    </div>
  );
}
