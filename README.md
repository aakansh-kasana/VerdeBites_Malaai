# Verde Bites Strategy Website

An interactive Next.js app showcasing pricing, channel mix, bundles/subscriptions, benchmarks, and rollout planning for the Verde Bites case.

## Prerequisites
- Node.js 20+
- PNPM (recommended) or npm/yarn

## Install
```bash
pnpm install
# or
npm install
```

## Run Dev Server
```bash
pnpm dev
# then open http://localhost:3000
```

## Build & Start
```bash
pnpm build
pnpm start
```

## App Structure
- Landing dashboard: `/` (components under `components/verde/*`)
- Strategy Studio (full interactive tool): `/verde/strategy`
- Core logic for Strategy Studio: `logic/logic.tsx` (client component `StrategyStudio`)

## How to Use
- From the hero section, click "Open Strategy Studio" to access the complete simulator.
- Adjust MSRP, channel mix, bundles, and subscription discount to see demand, contribution, and break-even impacts.

## Notes
- Tailwind v4 tooling included via `@tailwindcss/postcss` and `tailwindcss-animate`.
- Uses React 18 and Next.js 14.

## Scripts
- `pnpm dev`: Dev server
- `pnpm build`: Production build
- `pnpm start`: Start production server
- `pnpm lint`: Run Next.js lint
