# Aura --- Design System and Frontend Architecture

**Source of truth for visual behavior:** the supplied AURA Design
Architecture file.\
**Scope adjustment:** preserve its visual and interaction principles
while implementing only the frontend presentation prototype with dummy
data.\
**Product behavior authority:** `PRD.md`. If this file conflicts with
PRD behavior, PRD wins; this file governs visual presentation and
interaction details.

## 1. North star

Aura should feel like a bank-grade tool made by people who like
freelancers: **credible, calm, alive**.

-   Credible: explicit proof states, clear evidence context, honest
    prototype labels.
-   Calm: light green-grey canvas, quiet borders, disciplined emerald
    action color.
-   Alive: populated screens, meaningful state changes, useful next
    actions, subtle purposeful motion.

The signature visual is the **Claim Ring**: one arc per CV claim, with
each arc colored by the claim's proof status. Reuse it on discovery
cards, profiles, the CV page, and dashboards.

## 2. Brand and visual system

### 2.1 Logo and wordmark

-   Wordmark "Aura" in Source Serif 4, weight 600, tight tracking.
-   Logo mark: capital A with check-mark crossbar, SVG on a 24px grid
    with 2px stroke and rounded joins.
-   Mark size: 24px app header, 40px onboarding, 72px landing.
-   Emerald-600 mark on light surfaces; white on emerald/ink surfaces.
-   "by The_neighbourhood" only in landing footer, not app header.

### 2.2 Color tokens

Use CSS custom properties as the source of truth and map them into
Tailwind tokens. Avoid ad hoc raw hex values inside components.

  ---------------------------------------------------------------------------
  Token                   Value                   Use
  ----------------------- ----------------------- ---------------------------
  ink-900                 #16211C                 Primary text/headings

  ink-700                 #34423B                 Strong secondary text

  ink-600                 #4A5A52                 Secondary text

  ink-500                 #66766E                 Metadata on white only

  ink-400                 #94A39B                 Placeholder/disabled icons
                                                  only

  ink-300                 #C3CEC8                 Input/strong borders

  ink-200                 #DDE5E0                 Default borders/dividers

  ink-100                 #ECF1EE                 Sunken surfaces, table
                                                  headers

  canvas                  #F5F8F6                 Page background

  surface                 #FFFFFF                 Cards, inputs, menus

  emerald-50              #EEF8F3                 Selected fills/success
                                                  backgrounds

  emerald-100             #D9F0E5                 Verified chip background

  emerald-200             #B5E0CC                 Selected border

  emerald-500             #1F9A72                 Secondary progress/hover

  emerald-600             #0E7C59                 Primary action, brand,
                                                  verified

  emerald-700             #0B6648                 Hover/pressed

  emerald-800             #0A5039                 Dark text on emerald tint

  emerald-900             #083D2C                 Rare dark brand surface

  partial                 #1E5A6B / #DDEFF3       Partially verified
  foreground/background                           

  gold                    #8A5A00 / #FBF1DC       Priority and Gold level
  foreground/background                           

  warning                 #8A5300 / #FEF3D7       Review/deadline/prototype
  foreground/background                           warnings

  danger                  #B3261E / #FCE9E7       Disproved, rejected,
  foreground/background                           dispute
  ---------------------------------------------------------------------------

Rules: - Emerald-600 is used for at most one primary action per screen,
plus the logo and verified indicators. - No gradients, colored glows, or
glassmorphism. - Status is never conveyed by color alone: show icon plus
text. - Dark surfaces are reserved for the evaluator Demo Bar and its
menus. - Prototype/simulation status uses a visible warning or neutral
banner.

### 2.3 Typography

-   Display: Source Serif 4 variable, weight 600. Use for
    landing/onboarding titles, empty-state titles, certificate title and
    large Aura numerals.
-   UI: Hanken Grotesk variable, weights 400/500/600. Use for
    navigation, forms, cards, tables and buttons.
-   Use tabular numerals for prices, counts, scores and codes.
-   Check that the rupee glyph renders. Use a Noto Sans/system fallback
    if needed.
-   Sentence case throughout. No all-caps labels, tracked-out eyebrow
    labels, or isolated colored words in headlines.
-   Body line length 60--75 characters; reading column max 680px.

Type scale: - display-xl: 56/60 desktop, 40/44 mobile - display-l: 40/46
desktop, 32/38 mobile - h1: 28/36 - h2: 20/28 - h3: 16/24 - body:
14/22 - body-l: 16/26 - small: 13/20 - micro: 12/16 - numeral-xl: 56/56

### 2.4 Spacing and grid

-   4px base; use 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px.
-   Card padding: 16px mobile, 20px desktop, 24px for hero panels.
-   Page gutters: 16px mobile, 24px tablet, 32px desktop.
-   Max content width 1200px, centered.
-   Form column 520px; reading column 680px.
-   Desktop: 12 columns, 24px gap. Tablet: 8 columns, 16px gap. Mobile:
    4 columns, 16px gap.
-   Breakpoints: 640, 768, 1024, 1280px.

### 2.5 Radius, borders and elevation

-   Pill radius 999px: chips, avatars, levels, primary buttons.
-   `r-ctl`: 10px inputs/selects/secondary controls.
-   `r-card`: 14px cards, tables and banners.
-   `r-panel`: 20px large panels, modals and bottom sheets.
-   `r-deck`: 24px swipe cards.
-   Default surfaces use a 1px `ink-200` border, not a shadow.
-   `e1`: `0 1px 2px rgba(22,33,28,.06)` for hoverable cards.
-   `e2`: `0 8px 24px -8px rgba(22,33,28,.18), 0 0 0 1px #DDE5E0` for
    menus/popovers.
-   `e3`: `0 24px 48px -16px rgba(22,33,28,.28)` for dragged
    cards/modals.

### 2.6 Motion

-   fast 120ms, base 200ms, slow 320ms.
-   Entrance/movement easing: `cubic-bezier(.2, .8, .2, 1)`.
-   Exit easing: `cubic-bezier(.4, 0, 1, 1)`.
-   Direct-manipulation spring: stiffness 320, damping 32.
-   Respect `prefers-reduced-motion`: remove ring sweep and marquee, use
    120ms opacity changes.
-   Motion explains a response or state change; it must not be
    decorative.

### 2.7 Focus and touch

-   Keyboard focus ring: 2px emerald-600 with 2px white offset; on
    emerald surfaces add 2px ink-900 outline.
-   Hover: darken button one token step; interactive rows get `ink-100`
    fill and subtle elevation.
-   No hover scale transforms.
-   Disabled controls are visibly disabled and explain why.
-   Minimum touch target: 44px.
-   All interactions must be keyboard accessible.

## 3. Claim Ring and proof language

Each claim corresponds to one arc, with a 3-degree gap: - Verified:
emerald-600 - Partially verified: partial teal - Self-declared: ink-200
outline - Disproved: danger red

Sizes: - xs 28px, no numeral - sm 48px, numeral only - md 72px - lg
160px with score and level

On the large ring, focus/hover can reveal claim text and the demo proof
method. Accessible name should state score, level and verified-claim
count. Animate only the first dashboard appearance.

Because this is a mock-data demo, tooltips and status details must say
that the proof outcome is seeded/simulated where appropriate.

## 4. Shell and page templates

### 4.1 Desktop shell

-   56px white top bar with a 1px bottom border.
-   Content on `canvas`, max-width 1200px centered.
-   Hirer navigation: Search, Shortlist, My gigs, Dashboard.
-   Worker navigation: Dashboard, My CV, Bids, My gigs.
-   "How Aura works" popover: How verification works, Trials and escrow,
    Ratings and Aura Score, What is simulated in this prototype.
-   Avatar menu: name, role, account type, Account, Sign out of demo.
-   Do not add role switching to the avatar menu. Role/persona switching
    belongs in Demo Bar only.

### 4.2 Mobile shell

Below 1024px: - Header reduces to logo mark, page title and avatar. -
64px bottom tab bar with four role-specific tabs, icon above label,
active emerald state and 2px top indicator. - Demo Bar becomes a
floating 40px "Evaluator tools" pill above the tab bar; opens a bottom
sheet. - Reserve bottom padding so the bar never obscures content.

### 4.3 Page templates

-   Focus: centered 520px column, onboarding/landing, generous top
    space, no app navigation.
-   Workspace: title/description/action then content on 12-column grid.
-   Split: main 8 columns plus sticky 4-column trust/summary rail; on
    mobile collapse the rail into a card above main content.
-   Deck: 400--440px centered card deck, filter rail left and shortlist
    rail right on desktop; mobile deck plus filter sheet.
-   Never show a dead blank page: provide relevant counts, related
    items, or a specific next action. Empty states must still explain
    what to do.

## 5. Icons and generated visuals

-   Use `lucide-react`, stroke width 1.5; 16px inline, 20px buttons/nav,
    24px category tiles.
-   No emoji as icons.
-   Category icons: Vibecoding Sparkles; Web Development Globe; Video
    Editing Clapperboard; Software Braces; Architecture Design
    DraftingCompass; Social Media Marketing Megaphone; Design & Graphics
    Palette.
-   Proof icons: ShieldCheck, ShieldHalf/Shield, CircleDashed, ShieldX.
-   Role icons: BriefcaseBusiness and Laptop.
-   Use code-generated deterministic avatars and portfolio thumbnails;
    no stock photography.
-   Generate category-themed thumbnails: geometric composition for
    design, timeline/clips for video, browser wireframe for web,
    prompt/UI for vibecoding, token bars for software, floor plan for
    architecture, social post grid for marketing.
-   Watermarked trial preview: repeat "AURA SAMPLE · UNPAID PREVIEW"
    diagonally at low opacity and show "Preview only. Unpaid."
-   Landing collage should be assembled from actual UI components, not a
    static marketing image.

## 6. Component rules

### Buttons

-   Primary: emerald-600 fill, white text, pill, 40px default / 48px
    large; hover emerald-700.
-   Secondary: white, ink-300 border, ink-900 text, pill.
-   Quiet: no border, ink-700 text, `ink-100` hover.
-   Destructive: white with danger text/border; confirm in a modal.
-   Icon: 40px circle, `ink-100` fill, accessible name and tooltip.
-   Use verbs such as "Post brief", "Fund escrow", "Accept trial"; never
    use "Submit".
-   Loading spinner replaces leading icon while label remains and width
    stays fixed.

### Inputs

-   44px desktop, 48px mobile, 10px radius, white fill and ink-300
    border.
-   Labels above; helper text below.
-   Errors explain what went wrong and how to fix it.
-   Demo OTP uses six 48×56 boxes, auto-advance/paste support and
    visible "Demo code: 123456".
-   Never send an actual OTP.

### Chips and badges

-   Filter/skill chip: 28px pill, ink-100; selected emerald
    tint/border/check.
-   Proof chip: icon + word; tooltip gives method and explicitly
    identifies simulated outcomes.
-   Gig statuses: Bidding, Trial, Awaiting escrow, In progress,
    Delivered, Released, Disputed, Refunded / Split.
-   Verified hirer badge uses BadgeCheck and "Verified hirer"; if
    simulated, its tooltip clarifies this is a demo persona.

### Cards and tables

-   White, 14px radius, 1px ink-200 border, 20px desktop padding.
-   Prefer one grouped card with divided rows over a grid of redundant
    cards.
-   Tables have ink-100 header, 48--56px rows, hairline dividers and
    tabular numeric alignment.
-   On mobile, render primary table data as stacked label/value rows
    rather than forcing horizontal scrolling.

### Worker list card

Show avatar, name, verified indicator where appropriate, Claim Ring,
category/city, rate, rating/count, gigs, claims verified, up to three
skill chips plus `+n`, and a "Matched on" explanation. Earnings must be
described as earnings on Aura only.

### Swipe deck

-   Card width 400px (max 92vw), height about 560px desktop / 520px
    mobile.
-   Two cards peek behind: scale .95/translateY(12px), then
    .90/translateY(24px); hide back-card content.
-   Drag rotation x/18 degrees clamped ±14°.
-   Commit beyond 120px horizontal or 500px/s flick; priority via upward
    drag beyond -110px.
-   Exit 280ms, next card springs forward.
-   Actions: Skip (dark X, 64px), Priority (gold star, 52px), Shortlist
    (emerald, 64px), Undo.
-   Keyboard: left skip, right shortlist, up priority, Z undo, Enter
    opens profile.
-   Deck/List/Compare escape hatch always visible. Compare up to three
    workers.

### Gig stepper and escrow

Six numbered steps: Bidding, Trial, Escrow, Delivery, Review, Rating.
Escrow panel lists agreed amount, 8% platform fee and worker net, status
and simulated event timeline. Every panel states payment is simulated.

### Trial preview

Images use tiled watermark; writing shows the first 30% then
blurred/locked remainder; video/code use a preview tile and watermark
badge. Accept is primary; Reject is secondary-destructive and asks for
one reason: Off-brief, Quality below brief, Not my style, Other.

### Rating

Five-star keyboard-accessible control. Hirer rates Quality, Timeliness,
Communication; worker rates Clarity, Prompt payment, Communication.
Extreme ratings (1--2 or 5) require a 10--140 character explanation.
Demo reveal behavior is simulated and must not be represented as a real
reputation process.

### Feedback and overlays

-   Toast: desktop bottom-left above Demo Bar; mobile top; 4s.
-   Banner: semantic tint, icon and one sentence.
-   Modal/sheet: 20px radius, e3 shadow, 40% ink scrim, trapped focus,
    Escape closes; mobile uses bottom sheet.
-   Tooltip: dark ink, 12px, 300ms delay; never the sole source of
    essential info.
-   Skeletons match final shapes; shimmer stops for reduced motion.

## 7. Screen designs

### 7.1 Landing

-   Aura mark and wordmark; "How Aura works" menu.
-   Centered display-xl headline: "Hire people whose work you have seen,
    not just people who say they can."
-   Supporting line: "Every claim is checked. Every trial is free of
    risk." For the prototype, avoid implying live checks or real escrow;
    pair with a prototype disclosure.
-   Two equal role cards: "I want to hire" and "I want to work".
-   Live-looking product collage composed of worker card, Claim Ring,
    watermarked trial and escrow ledger components. One choreographed
    700ms entrance only.
-   Four mini-components for Verify · Try · Pay · Earn.
-   Footer says payments, DigiLocker and OTP are simulated in the
    prototype and links to "What is simulated".

### 7.2 Registration and verification

-   Focus template, 520px column, step indicator.
-   Individual/Studio segmented control.
-   One grouped checklist card: mobile, email, identity, payment method
    for hirer or payout UPI for worker.
-   Identity opens a simulated DigiLocker consent sheet and shows a demo
    reference only; never request/store real ID.
-   Studio fields: business name, GSTIN, business email, authorised
    signatory. Validation is local demo validation only.
-   Account-under-review state blocks continuation and explains why.
-   Continue is enabled only when demo checks are complete; disabled
    state names the missing check.
-   Desktop side panel "What we check and why"; collapse on mobile.

### 7.3 Interests

-   Exactly seven category tiles: Vibecoding, Web Development, Video
    Editing, Software, Architecture Design, Social Media Marketing,
    Design & Graphics.
-   Flat tonal tiles, thin green line icons, two-line labels, selected
    outline. No gradients.

### 7.4 Hirer search

-   Search field with example queries and suggestion pills.
-   Result mode control: Deck / List / Compare.
-   Deck uses swipe cards and keyboard controls.
-   List uses worker list cards.
-   Compare supports up to three candidates and rows for verified
    claims, rate, rating, gigs and skills.
-   Filters are available in a mobile sheet.

### 7.5 Worker profile

-   Header: 80px avatar, name, verified tick if seeded, category, city,
    Claim Ring, rate, rating, gigs and relevant action.
-   Main: short bio, claims list with type/proof/method/date, portfolio
    grid, ratings with criteria bars, signed declaration.
-   Right rail: trust summary, verified claim count, counted gigs,
    average rating, on-time delivery, streak, shortlist/favourite
    controls.
-   Every seeded "verified" outcome has a demo explanation.

### 7.6 Hirer dashboard

-   Greeting and New search.
-   One connected four-cell stat strip: Active, Accepted, Rejected,
    Completed. Selecting a cell filters the gig table.
-   Favourite workers as compact rows.
-   Gigs table: gig, worker, stage, budget, next action.
-   Do not show Aura Score on the hirer dashboard.

### 7.7 Shortlist and post brief

-   Shortlist list with priority workers first; actions Post a brief and
    Remove.
-   Post brief single 680px form plus right rail of invitees.
-   Fields: title, deliverables, budget min/max, deadline, trial scope.
-   No skills field.
-   Helper: "Describe one small task a worker can show you. Keep it
    short so nobody is asked to work for free."
-   Button: "Post brief and invite N workers".

### 7.8 Gig workspace

-   Split template, six-step stepper, sticky escrow rail.
-   Stage-specific content:
    -   Bidding: shortlist, bids and comments.
    -   Trial: watermarked previews, accept/reject, reason.
    -   Escrow: expanded ledger and "Simulated payment. In production
        this goes through a payment gateway."
    -   In progress: worker upload area/notes; hirer waiting card and
        due date.
    -   Delivered: preview, Approve and release, Raise dispute,
        countdown.
    -   Disputed: danger banner, both parties' notes, reviewer decision;
        funds described as simulated/frozen in demo.
    -   Released: success banner, certificate and rating panel.

### 7.9 Worker CV and claims

-   `.docx` upload dropzone as a visual demo only. State clearly that no
    real parsing/upload occurs.
-   Simulated parser skeleton then seeded claims.
-   Each claim row has type icon, editable text, proof chip, and
    actions: Verify via DigiLocker, Add proof link, Check account
    ownership, Ask a client to confirm, Edit, Delete. Actions are
    simulations.
-   Sticky right rail: Claim Ring, "n of m claims verified", Aura Score
    preview, signed declaration.
-   Go live in discovery disabled until the declaration is signed; show
    the reason.

### 7.10 Worker dashboard

-   Claim Ring and Aura Score/level.
-   Four-cell stats: streak, claims verified, average rating, earned on
    Aura.
-   11-step streak tracker and 12-week heatmap.
-   Recent bids table with brief, hirer, budget, deadline, status and
    Open.

### 7.11 Bids

-   List and detail views.
-   Bid detail shows brief, trial scope, deliverables and form.
-   Right rail "Hirer facts": rating, on-time payment percentage,
    accepted trials and completed gigs; these are demo metrics.
-   Show an illustrative Aura change (e.g. 76 → 78) with an explanation
    that this is demo scoring logic, not a validated production
    algorithm.

### 7.12 Certificate

-   Centered 560px certificate card, white, 1px border, 2px emerald
    inner hairline.
-   Serif title "Certificate of completion", worker, gig, issue date,
    hirer, simulated escrow-release confirmation, code `AURA-XXXX-YYYY`,
    96px QR code and subtle emerald seal.
-   Actions: Copy link and Download as image if implemented.
-   `#/verify/:code`: standalone page without nav. Valid seeded code
    says "This certificate is genuine in the demo dataset"; unknown code
    gives a helpful not-found message.

### 7.13 Account and help

-   Account menu reaches Profile, Verification, Payments, Notifications
    and Reset this demo.
-   Grouped settings rows with helper text, values/status chips, inline
    edit where useful.
-   "How verification works" is a 680px reading column with table
    columns: Feature, What it does in this prototype, What production
    would use. Include OTP, DigiLocker, payments/escrow, GST lookup,
    account ownership and client confirmation.
-   End with: "Nothing here is hidden: if it's simulated, we say so."

### 7.14 Demo Bar

-   44px dark bar, #1B2420, amber "Evaluator tools" label.
-   Persona dropdown grouped Hirers and Workers.
-   Demo date plus +1 day, +3 days, +5 days.
-   Review Desk appears only during a dispute, with Release to worker,
    Refund to hirer, Split 50/50.
-   Reset demo.
-   On mobile, a floating pill opens a bottom sheet. Add bottom page
    padding so it never obscures content.
-   The Demo Bar is clearly separate from product navigation and may
    persist its state for the presentation.

## 8. Voice and microcopy

-   Plain, direct, specific, active voice; sentence case.
-   Buttons describe outcomes: "Post brief", "Fund escrow", "Accept
    trial", "Approve and release".
-   Errors state what went wrong and how to fix it.
-   Disabled controls explain why.
-   Avoid unsupported superlatives such as "Top 1%".
-   Never say "verified by DigiLocker" unless the UI explicitly labels
    it as a simulated demo outcome.
-   Use "Partially verified" consistently; do not conflate it with
    "disproved".

## 9. Responsive and accessibility requirements

-   Desktop ≥1024px uses top nav; mobile uses bottom tabs.
-   All key workflows must remain usable at 320px viewport width.
-   44px minimum touch targets.
-   Keyboard navigation and visible focus.
-   Semantic headings, buttons, form labels and list/table structure.
-   Accessible names for icon-only actions and Claim Ring.
-   Reduced-motion support.
-   Status labels use icon + text, never color alone.
-   Avoid horizontal scrolling for primary mobile data.
-   Test rupee rendering and contrast for text/status chips.

## 10. Frontend implementation guidance

-   Use reusable components for buttons, inputs, chips, cards, Claim
    Ring, worker cards, tables, stepper, escrow ledger, trial preview,
    rating, toasts, modal/sheet, skeletons and Demo Bar.
-   Store design tokens centrally in CSS variables and Tailwind
    configuration.
-   Keep generated avatar and portfolio thumbnail functions
    deterministic from a stable ID.
-   Keep presentation data separate from visual components.
-   All prototype behavior is client-side and local. No real API calls
    or secret values.
