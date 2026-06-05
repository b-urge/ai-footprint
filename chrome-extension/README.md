# AI Carbon Footprint — Chrome Extension

Passive tracker for **ChatGPT** and **Claude**. Counts assistant replies, estimates tokens, and rolls up daily water / energy / CO₂.

Pairs with the web dashboard: https://ai-footprint-plum.vercel.app

## Install (unpacked, for hackathon judges)

1. Build:
   ```bash
   cd chrome-extension
   npm install
   npm run build
   ```
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode**
4. **Load unpacked** → select the `chrome-extension/dist` folder
5. Visit [chatgpt.com](https://chatgpt.com) or [claude.ai](https://claude.ai) and chat — badge shows today’s water (mL)

## How it works

- **Content scripts** watch the conversation DOM for completed assistant messages (1.2s stability debounce, skips streaming).
- **Service worker** estimates tokens, applies model multipliers, updates `chrome.storage.local` daily totals.
- **Badge**: green &lt; 50 mL, amber 50–200 mL, red &gt; 200 mL water today.
- **Popup**: today’s metrics + top comparisons + link to full dashboard.

## Permissions

- `storage` — local daily stats only
- Host access: `chatgpt.com`, `chat.openai.com`, `claude.ai`

## Dev

```bash
npm run dev   # watch build (reload extension after changes)
```

## Privacy

No network calls from the extension. No telemetry.
