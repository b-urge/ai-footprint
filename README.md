# AI Carbon Footprint Visualizer

**Every AI conversation has a hidden environmental cost. This makes it visible.**

- **Live demo:** https://ai-footprint-plum.vercel.app
- **Repository:** https://github.com/b-urge/ai-footprint

Paste any AI conversation and instantly see its water usage, energy consumption,
and CO2 emissions — with visceral real-world comparisons.

## What it does

- Estimates token count from pasted AI conversations
- Calculates water (mL), energy (Wh), and CO2 (grams) per conversation
- Shows real-world equivalents: toilet flushes, phone charges, miles driven
- Supports multiple AI models with different environmental profiles
- Animated real-time dashboard with smooth count-up effects

## How it works

1. **Token estimation**: 1 token ~ 4 characters (prose) or 3 characters (code)
2. **Impact calculation**: Per-1K-token rates from peer-reviewed research, scaled by model size
3. **Comparisons**: Impact values mapped to everyday activities using EPA/USGS/DOE benchmarks

## Environmental data sources

- Water usage: Shaolei Ren et al., "Making AI Less Thirsty" (UC Riverside, 2023)
- Energy: IEA "Electricity 2024", Patterson et al. (Google, 2021)
- CO2: US EPA eGRID 2023 (US grid average)
- Comparison benchmarks: EPA, USGS, DOE

## Tech stack

- Next.js + TypeScript + Tailwind CSS + Framer Motion
- No backend — all computation client-side
- Deployed on Vercel

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Chrome extension

Passive tracking on ChatGPT and Claude. See [chrome-extension/README.md](./chrome-extension/README.md).

```bash
cd chrome-extension && npm install && npm run build
```

Then load `chrome-extension/dist` as an unpacked extension in `chrome://extensions`.

## Deploy

```bash
npx vercel --prod
```

## What is next

- Chrome extension that passively tracks AI usage across ChatGPT, Claude, Gemini
- Real tokenizer integration for exact counts
- Historical tracking and monthly summaries
- Cross-device sync with anonymized aggregate stats

## License

MIT
