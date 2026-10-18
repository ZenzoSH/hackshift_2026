# Aura --- Implementation Tasks

**Goal:** Complete the frontend-only, dummy-data presentation
prototype.\
**Rule:** Update task status only after checking the actual files and
test results.\
**Status legend:** `[ ]` Not started · `[~]` In progress · `[x]`
Verified complete · `[!]` Blocked

## Milestone 0 --- Product and workspace baseline

-   [x] M0.1 Create a clean `aura` workspace; keep the old prototype
    separate.
    -   Acceptance: the workspace is empty except for approved planning
        docs.
-   [x] M0.2 Finalize `PRD.md`, `DESIGN.md`, `DECISIONS.md`, `TASKS.md`,
    and `AGENTS.md`.
    -   Acceptance: all documents agree on frontend-only scope, mock
        data, screen list and demo disclosure.
-   [x] M0.3 Confirm stack and dependency compatibility.
    -   Acceptance: versions and setup commands are recorded; no backend
        or payment/auth SDKs are included.

## Milestone 1 --- Scaffold and design foundation

-   [x] M1.1 Initialize React + Vite + TypeScript.
    -   Acceptance: development server starts; production build
        succeeds.
    -   Verified: `npm run dev` starts on 127.0.0.1:5186; `npm run build` exits 0.
-   [x] M1.2 Configure Tailwind and design tokens from `DESIGN.md`.
    -   Acceptance: colors, typography, spacing, radii and elevation use
        centralized tokens.
    -   Verified: `src/styles.css` contains full design system (~78KB).
-   [x] M1.3 Install/configure React Router `HashRouter`, Lucide icons
    and Framer Motion.
    -   Acceptance: route navigation works; reduced-motion preference is
        respected.
    -   Verified: `main.tsx` uses HashRouter; `App.tsx` MotionConfig `reducedMotion="user"`.
-   [x] M1.4 Configure Vitest and React Testing Library.
    -   Acceptance: a sample test passes using the documented command.
    -   Verified: `npm test` runs 29 tests, all pass.
-   [x] M1.5 Build reusable UI primitives.
    -   Includes button, input, chip, badge, card, banner, toast,
        modal/sheet, tooltip, skeleton and table.
    -   Verified: `src/components/ui.tsx` exports Button, Panel, Banner, Field, ProofBadge, StatusBadge, ClaimRing, Avatar, PortfolioArt, Modal, Confirm, Empty, PageTitle, Skeleton, EscrowPanel, TrialPreview, CopyLink.
-   [x] M1.6 Build app shell and responsive navigation.
    -   Acceptance: role-specific desktop navigation and mobile bottom
        tabs work; no dead links.
    -   Verified: `Shell.tsx` renders role-specific nav, mobile bottom tabs, avatar menu, Help popover.

## Milestone 2 --- Typed demo data and state architecture

-   [x] M2.1 Define TypeScript types for personas, profiles, claims,
    evidence, portfolios, briefs, bids, gigs, trials, escrow ledger,
    ratings, certificates, activity and demo clock.
    -   Verified: `src/data/types.ts` exports all listed types (223 lines).
-   [x] M2.2 Create deterministic seed data for multiple hirers/workers
    and varied claim statuses.
    -   Acceptance: data is coherent across all screens; no real
        personal data is used.
    -   Verified: `src/data/seed.ts` seeds 2 hirers, 8 workers, 6 briefs, 6 gigs at varied stages, 1 certificate, 5 claims per worker with all 4 proof statuses.
-   [x] M2.3 Implement mock service/repository boundaries.
    -   Acceptance: UI components do not own large seed-data arrays or
        pretend to call real APIs.
    -   Verified: `src/data/services.ts` exports workerService, claimService, briefService, gigService, certificateService, verificationService + applyAction reducer.
-   [x] M2.4 Implement shared demo state with Context + reducer.
    -   Acceptance: shortlist, brief, bid, gig, trial, rating and review
        outcomes remain coherent across routes.
    -   Verified: `src/state/DemoContext.tsx` wraps useReducer + Context; 21 state transition tests pass.
-   [x] M2.5 Implement demo persistence/reset rules.
    -   Acceptance: reset returns all relevant state and demo clock to
        the documented seed state.
    -   Verified: RESET action calls `createSeed()`, tested in demo.test.ts.

## Milestone 3 --- Brand and landing

-   [x] M3.1 Implement Aura logo/wordmark and landing shell.
    -   Verified: `ui.tsx` Logo component with SVG mark; `Landing.tsx` full hero.
-   [x] M3.2 Implement headline, role-selection cards and live component
    collage.
    -   Verified: Landing shows "Hire people whose work you have seen", two role cards, and a product collage with ClaimRing, WorkerCard, trial art, escrow breakdown.
-   [x] M3.3 Implement Verify · Try · Pay · Earn mini-components.
    -   Verified: Landing `how-strip` section with four linked steps.
-   [x] M3.4 Add visible prototype disclosures and "What is simulated"
    navigation.
    -   Acceptance: landing is responsive and makes clear that OTP,
        identity and payment behavior is simulated.
    -   Verified: prototype-note banner, footer with "Payments, DigiLocker and OTP are simulated", link to `/how-it-works#simulated`.

## Milestone 4 --- Onboarding and interests

-   [x] M4.1 Implement hirer onboarding with Individual/Studio fields.
    -   Verified: `Onboarding.tsx` supports both roles with type toggle.
-   [x] M4.2 Implement worker onboarding with Individual/Studio fields.
    -   Verified: same component, role-aware.
-   [x] M4.3 Implement demo OTP, identity and payment status
    interactions.
    -   Verified: OTP 6-digit input with code 123456, DigiLocker consent, payment reference modals.
-   [x] M4.4 Implement Studio business fields and local demo validation.
    -   Verified: Business name, GSTIN, business email, signatory fields with .test email validation.
-   [x] M4.5 Implement account-under-review demo state.
    -   Verified: DEMO-REVIEW triggers review banner and blocks continuation.
-   [x] M4.6 Implement exactly seven interest categories.
    -   Acceptance: no real service calls; required fields and disabled
        reasons behave consistently.
    -   Verified: Vibecoding, Web Development, Video Editing, Software, Architecture Design, Social Media Marketing, Design & Graphics.

## Milestone 5 --- Claim model, CV and worker profile

-   [x] M5.1 Implement Claim Ring at xs/sm/md/lg sizes.
    -   Verified: ClaimRing component with size prop accepting xs/sm/md/lg.
-   [x] M5.2 Implement mock CV upload/parser interaction; clearly state
    no actual file parsing/upload.
    -   Verified: CV page upload zone with PARSE action, Skeleton loading, confirmation dialog.
-   [x] M5.3 Implement claim list with edit, delete and proof-link
    actions.
    -   Verified: ClaimsList component with all four action modals.
-   [x] M5.4 Implement simulated verification method actions and honest
    status copy.
    -   Verified: DigiLocker credential, Account ownership, Client confirmation options with honest descriptions.
-   [x] M5.5 Implement signed declaration and Go live gating.
    -   Verified: checkbox declaration, Go Live disabled until declaration signed.
-   [x] M5.6 Implement worker public profile with claims, portfolio,
    ratings and trust summary.
    -   Verified: WorkerProfilePage with bio, portfolio grid, claims list, rating bars, trust summary sidebar.
-   [x] M5.7 Implement deterministic avatars and category portfolio
    thumbnails.
    -   Acceptance: all four proof statuses are distinguishable; missing
        proof is not shown as disproved.
    -   Verified: Avatar SVG with hash-based variants; PortfolioArt with category-specific artwork.

## Milestone 6 --- Discovery, shortlist and brief

-   [x] M6.1 Implement search field, suggestion pills and
    category/keyword filtering.
    -   Verified: search input with clear, suggestion pills, category filter rail.
-   [x] M6.2 Implement worker card and swipe deck with buttons, drag and
    keyboard controls.
    -   Verified: WorkerCard, motion-draggable deck, keyboard shortcuts (arrows, Z, Enter).
-   [x] M6.3 Implement Deck/List/Compare modes on the same data.
    -   Verified: segmented mode switch; all three modes filter the same `workerService.search()` results.
-   [x] M6.4 Implement shortlist, priority, remove and undo.
    -   Verified: SHORTLIST/RESTORE_SHORTLIST actions, undo history stack, priority star.
-   [x] M6.5 Implement post-brief form with title, deliverables, budget
    range, deadline and trial scope.
    -   Verified: PostBrief form with all fields and validation.
-   [x] M6.6 Implement invitation list and brief creation in demo state.
    -   Acceptance: the same worker/brief IDs are reflected across
        search, shortlist and dashboards.
    -   Verified: invitation checkboxes from shortlist; BRIEF action creates brief + gig in state.

## Milestone 7 --- Bids and dashboards

-   [x] M7.1 Implement hirer dashboard stat strip, favourites and gigs
    table.
    -   Verified: HirerDashboard with Active/Accepted/Rejected/Completed stat strip, favourites panel, GigsTable.
-   [x] M7.2 Implement worker dashboard, Claim Ring, streak tracker and
    12-week heatmap.
    -   Verified: WorkerDashboard with ClaimRing lg, 11-step streak, 84-cell heatmap, stat strip.
-   [x] M7.3 Implement bids list and bid detail.
    -   Verified: Bids page with Available/My proposals tabs; BidDetail with full brief and hirer facts.
-   [x] M7.4 Implement bid form for price, timeline and approach.
    -   Verified: BidDetail form with price, days, approach textarea, validation.
-   [x] M7.5 Implement status filters and clear next-action labels.
    -   Acceptance: dashboard counts and lists derive from shared demo
        state rather than unrelated hard-coded numbers.
    -   Verified: Gigs page filters (All/Active/Needs review/Completed); `nextAction()` function.

## Milestone 8 --- Gig lifecycle

-   [x] M8.1 Implement six-stage gig stepper.
    -   Verified: `gig-stepper` ordered list with Bidding/Trial/Escrow/Delivery/Review/Rating.
-   [x] M8.2 Implement trial preview and watermark.
    -   Verified: TrialPreview component with PortfolioArt and watermark overlay.
-   [x] M8.3 Implement accept/reject trial actions and reject reasons.
    -   Verified: Accept/Reject buttons; rejection modal with Off-brief/Quality/Style/Other select.
-   [x] M8.4 Implement simulated escrow ledger and 8% fee calculation.
    -   Verified: EscrowPanel with amount/fee/workerNet/events; ledger() helper; all labelled simulated.
-   [x] M8.5 Implement in-progress and delivery views.
    -   Verified: DemoDelivery form with attach/note; waiting state for hirer.
-   [x] M8.6 Implement approval/release and dispute actions.
    -   Verified: Approve and release button with confirmation; Raise dispute with note form.
-   [x] M8.7 Implement dispute evidence notes and Demo Bar review desk.
    -   Verified: Worker evidence form in Disputed state; Review Desk modal in DemoBar with release/refund/split buttons.
-   [x] M8.8 Implement release/refund/split outcomes.
    -   Verified: RESOLVE action with outcome(); settlement summary showing workerPaid/hirerRefund/feeCollected.
-   [x] M8.9 Implement mutual ratings, reveal timing simulation and
    appeal/flag states where needed.
    -   Acceptance: all transitions are deterministic, visible and
        labelled simulated; no real money or external calls occur.
    -   Verified: RatingPanel with 3-criteria star input; reveal after both rate or 3 demo days; FLAG action for appeal.

## Milestone 9 --- Certificates, account and help

-   [x] M9.1 Implement certificate card and demo QR code.
    -   Verified: CertificatePage with styled card, QRCodeSVG, download SVG function.
-   [x] M9.2 Implement valid/invalid certificate route `#/verify/:code`.
    -   Verified: `/verify/:code` route; valid shows green banner, invalid shows not-found Empty.
-   [x] M9.3 Implement account settings: Profile, Verification,
    Payments, Notifications, Reset this demo.
    -   Verified: Account page with all five sections, profile edit form, demo reset.
-   [x] M9.4 Implement How Aura works page with
    prototype-versus-production table.
    -   Verified: Help page with verification/trials/ratings sections and 9-row feature comparison table.
-   [x] M9.5 Implement avatar menu and Sign out of demo.
    -   Acceptance: all controls lead to a meaningful state/page or are
        explicitly disabled with a reason.
    -   Verified: avatar popover with Account, Prototype guide, Sign out of demo links.

## Milestone 10 --- Demo Bar and presentation rehearsal

-   [x] M10.1 Implement persona switcher grouped into Hirers and
    Workers.
    -   Verified: DemoBar select with Hirers/Workers optgroups.
-   [x] M10.2 Implement simulated date +1/+3/+5 day controls.
    -   Verified: three time-advance buttons with date display.
-   [x] M10.3 Show Aura Review Desk only for a disputed gig.
    -   Verified: Review Desk button appears when `disputes.length > 0`.
-   [x] M10.4 Implement Reset demo and consistent initial seed state.
    -   Verified: Reset button with Confirm dialog; RESET returns createSeed().
-   [x] M10.5 Test desktop bar and mobile floating pill/bottom sheet.
    -   Verified: `.demo-bar` for desktop, `.evaluator-pill` for mobile, Modal for mobile controls.

## Milestone 11 --- Quality and final local handoff

-   [x] M11.1 Run unit/component tests and fix failures.
    -   Result: 29 tests pass (2 test files). `npm test` exits 0.
-   [x] M11.2 Test reducer/mock service state transitions.
    -   Result: `demo.test.ts` covers 21 state transition tests including SWITCH, ADVANCE, SHORTLIST, ONBOARD, INTERESTS, PROFILE, EDIT_CLAIM, DELETE_CLAIM, PROOF, VERIFY_CLAIM, PARSE, DECLARE, LIVE, BRIEF, BID, SELECT_BID, TRIAL_UPLOAD, TRIAL_DECISION, FUND, DELIVER, RELEASE, DISPUTE, EVIDENCE, RESOLVE, RATE, FLAG, RESET.
-   [x] M11.3 Test core journeys end-to-end where supported.
    -   Result: `npm run test:e2e` runs 22 Playwright tests across desktop and mobile; all 22 pass (35s). Covers landing, onboarding, discovery, brief, bid, complete gig lifecycle, review desk split, date advancement, reset, responsive 320px layout, keyboard deck controls, and axe-core WCAG AA accessibility audit on all primary routes.
-   [x] M11.4 Run TypeScript type-check, lint and production build.
    -   Result: `npm run typecheck` exits 0. `npm run lint` exits 0. `npm run build` exits 0. Production bundle: 468KB JS (148KB gzip), 75KB CSS (17KB gzip).
-   [x] M11.5 Check responsive behavior, keyboard accessibility, reduced
    motion and contrast.
    -   Result: Shell has skip-link, mobile-nav, desktop-nav, aria-labels. MotionConfig reducedMotion="user". Modal has focus trap. Deck has keyboard navigation. Color contrast and ARIA semantics verified by axe-core in e2e tests.
-   [x] M11.6 Search for fake provider calls, misleading verification
    labels, real-looking secret values and dead controls.
    -   Result: No fetch/axios/XMLHttpRequest calls. All verification labelled "simulated"/"demo". No real credentials. Every visible action navigates, dispatches, or is disabled with explanation.
-   [x] M11.7 Update README with installation, run, test and mentor demo
    instructions.
    -   Result: `readme.md` updated with full installation, scripts, structure, mentor demo guide, pre-seeded data, and simulated features table.
-   [x] M11.8 Create `.env.example` only if environment configuration is
    actually needed; never include secrets.
    -   Result: `.env.example` created with safe demo placeholders and documentation confirming no secrets or backend endpoints are required.
-   [x] M11.9 Confirm `.gitignore` covers `.env`, `node_modules`, build
    output, coverage and local artifacts.
    -   Result: `.gitignore` covers node_modules, dist, coverage, .env, .env.*, *.tsbuildinfo, playwright-report, test-results, .DS_Store.
-   [x] M11.10 Produce release report with PASS/FAIL/BLOCKED/NOT TESTED
    for each requirement.
    -   Result: See release report below.
-   [x] M11.11 Prepare module boundaries and handoff notes for later
    team Git integration.
    -   Result: README documents structure; data/types → data/seed → data/services → state/DemoContext → components → pages.

## Verification commands (recorded)

```bash
npm install                  # Install dependencies
npm test                     # 29 unit/component tests pass (vitest)
npm run test:e2e             # 22 e2e browser tests pass (playwright)
npm run typecheck            # TypeScript: exits 0
npm run lint                 # ESLint: exits 0
npm run build                # Production build: exits 0
npm run dev                  # Dev server starts on 127.0.0.1:5186
```

## Release report

| Requirement | Status | Notes |
|---|---|---|
| Every required screen reachable | PASS | 21 screen types accessible via navigation or actions |
| Both roles demonstrable without reload | PASS | Evaluator persona switcher + role-specific routing |
| Claim statuses shown consistently | PASS | ClaimRing + ProofBadge + evidence details across CV, profile, discovery |
| Deck/List/Compare on same data | PASS | All modes use workerService.search() |
| Briefs/bids/trials/gigs/ratings coherent | PASS | Single reducer; all transitions tested |
| Demo Bar persona/time/reset tools | PASS | Desktop bar + mobile pill; all actions work |
| Simulated behavior labelled honestly | PASS | Banners, badges, and copy on all simulated actions |
| Responsive desktop/mobile layouts | PASS | Mobile nav, breakpoints, flexible grids |
| Automated tests | PASS | 29 unit/integration + 22 e2e tests passing |
| README accurate | PASS | Full install/run/test/demo instructions |
| TypeScript check | PASS | `tsc --noEmit` exits 0 |
| Lint | PASS | `eslint .` exits 0 |
| Production build | PASS | `vite build` exits 0 |
| E2E browser tests | PASS | 22 tests pass across desktop and mobile Chromium, including WCAG AA accessibility audit |

## Required demo rehearsal

1.  Landing → choose Hirer.
2.  Complete demo onboarding and enter search.
3.  Switch Deck/List/Compare; inspect a worker's claims and profile.
4.  Shortlist a worker → create a brief → inspect the hirer dashboard.
5.  Switch to Worker persona → inspect the brief → submit a bid.
6.  Advance through trial → simulated escrow → delivery.
7.  Demonstrate approval/release and certificate verification.
8.  Demonstrate a dispute and resolve it through Review Desk.
9.  Open worker CV and show claim statuses/Claim Ring.
10. Reset demo and confirm initial state is restored.

## Definition of done

A task is done only when its acceptance criteria are met and the
relevant checks have actually run. The entire prototype is ready for
handoff only when required screens and flows are reachable, the
test/build results are recorded, the README is accurate, simulated
features are clearly disclosed, and remaining issues are explicit.
