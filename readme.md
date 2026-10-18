# Aura — Work speaks.

A trust-first freelance marketplace prototype. This is a **frontend-only interactive presentation** built for the HackShift 2026 hackathon at IIIT Delhi by **The Neighbourhood**.

> **All verification, payments, identity checks and provider integrations are simulated.** No real data is collected, no external service is contacted, and no money moves.

---

## Quick start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
# → opens at http://127.0.0.1:5186

# Run the production build
npm run build

# Preview the production build
npm run preview
```

## Available scripts

| Script             | What it does                                 |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Start the Vite dev server at `127.0.0.1:5186`|
| `npm run build`    | TypeScript check + Vite production build     |
| `npm run preview`  | Serve the `dist/` production build locally   |
| `npm run typecheck`| TypeScript `--noEmit` check                  |
| `npm run lint`     | ESLint across the project                    |
| `npm run test`     | Run Vitest unit and component tests          |
| `npm run test:watch`| Vitest in watch mode                        |
| `npm run test:e2e` | Playwright end-to-end tests                  |
| `npm run format`   | Prettier format (write)                      |
| `npm run format:check` | Prettier format check                    |

## Technology stack

- **React 18** with TypeScript (strict mode)
- **Vite 8** for build and dev server
- **Tailwind CSS v4** for utility-based styling
- **React Router 7** with `HashRouter` for client-side routing
- **Framer Motion** for animations (respects `prefers-reduced-motion`)
- **Lucide React** for icons
- **qrcode.react** for demo certificate QR codes
- **Vitest** + React Testing Library for unit/component tests
- **Playwright** for end-to-end tests

## Project structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Route definitions
├── styles.css            # All styles and design tokens
├── components/
│   ├── Shell.tsx          # App header, navigation, Demo Bar, toast
│   ├── WorkerCard.tsx     # Worker card component
│   ├── ui.tsx             # Reusable UI primitives
│   └── ui.test.tsx        # UI component tests
├── data/
│   ├── types.ts           # TypeScript types for all domain entities
│   ├── seed.ts            # Deterministic mock data
│   └── services.ts        # Mock service layer + state reducer
├── pages/
│   ├── Landing.tsx        # Landing page with hero and collage
│   ├── Onboarding.tsx     # Hirer/worker onboarding + interests
│   ├── Discovery.tsx      # Search, deck/list/compare, shortlist
│   ├── Claims.tsx         # Worker CV, claims, profile
│   ├── Marketplace.tsx    # Post brief, bids list, bid detail
│   ├── Dashboard.tsx      # Hirer/worker dashboards, gigs table
│   ├── GigWorkspace.tsx   # Full gig lifecycle (6 stages)
│   └── Supporting.tsx     # Certificate, account, how it works
├── state/
│   ├── DemoContext.tsx     # React Context + reducer
│   └── demo.test.ts       # State transition tests
└── test/
    └── setup.ts           # Vitest test environment setup
```

## Mentor demo guide

The prototype is designed for a live walkthrough. Use the **Evaluator tools** (dark bar at the bottom on desktop, floating pill on mobile) to switch personas, advance the demo clock, resolve disputes, and reset.

### Recommended demo flow

1. **Landing** → Choose **I want to hire**
2. Complete **demo onboarding** (use code `123456` for OTP, click through identity/payment)
3. Select interests → Enter **Search/Discovery**
4. Switch between **Deck / List / Compare** modes; inspect a worker's Claim Ring and profile
5. **Shortlist** a worker → navigate to **Post brief** → create a brief with invitees
6. Open the **hirer Dashboard** to see the new gig
7. **Switch to Worker persona** (Evaluator tools → select a worker like Aanya Sharma)
8. Open **Bids** → view the brief → **submit a proposal**
9. **Switch back to Hirer** → open the gig workspace → **select the bid** → request trial
10. **Switch to Worker** → upload a demo sample → switch to Hirer → **accept/reject trial**
11. **Fund simulated escrow** → switch to Worker → **deliver** → switch to Hirer
12. **Approve and release** (or raise a dispute)
13. **Rate** from both sides → see certificate generated
14. Open **certificate** → verify via `#/verify/AURA-2026-0001`
15. Open a **dispute** scenario (gig g4 is pre-seeded as Disputed) → use **Review Desk**
16. Open worker **My CV** → explore claim editing, proof links, demo verification
17. **Reset demo** → confirm initial state is restored

### Demo OTP code

All simulated OTP checks use: **`123456`**

### Demo GSTIN values

- `DEMO-GST-OK` → passes the simulated check
- `DEMO-REVIEW` → triggers the "Account under review" state

### Pre-seeded data

- **2 hirers**: Arjun Malhotra (Studio), Leela Sen (Individual)
- **8 workers**: Aanya, Kabir, Meera, Rohan, Ishaan, Tara, Neel, Maya
- **6 briefs** with gigs at different stages (Bidding, Trial, Delivered, Disputed, Completed)
- **1 certificate**: `AURA-2026-0001`
- Demo date starts at **18 October 2026**

## What is simulated

| Feature              | Prototype behavior                                                                 |
| -------------------- | ---------------------------------------------------------------------------------- |
| OTP                  | Code `123456` checked locally                                                      |
| DigiLocker / identity| Consent panel with seeded outcome; no documents requested                          |
| Payments / escrow    | Local ledger with 8% fee; release/refund/split scenarios; no money moves           |
| GST lookup           | `DEMO-GST-OK` and `DEMO-REVIEW` simulate two outcomes                             |
| CV parsing           | Loads five fictional claims from bundled data; no file read                        |
| Aura Score           | Seeded baseline +2 per released, mutually rated gig; not a validated algorithm     |
| Certificate          | Local code lookup with QR link; not cryptographically verified                     |
| Ratings              | Reveal after both respond or 3 demo days; no production reputation system          |

## Proof statuses

- **Verified** — seeded strong-proof outcome (not real verification)
- **Partially verified** — evidence exists but contribution/ownership unconfirmed
- **Self-declared** — worker statement without adequate proof (≠ fraud)
- **Disproved** — explicit seeded contradiction (never inferred from absence)

## Key product principles

- **Claim-level, not profile-level**: each claim has its own evidence status
- **Evidence ≠ attribution**: a portfolio link doesn't prove authorship
- **No false certainty**: missing evidence is not proof of fraud
- **Try before pay**: watermarked, unpaid trial previews
- **Honest prototype**: every simulated action is labelled

---

Built with care by **The Neighbourhood** for HackShift 2026, IIIT Delhi.
