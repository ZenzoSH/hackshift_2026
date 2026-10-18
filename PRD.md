# Aura --- Product Requirements Document

**Status:** Draft for mentor-presentation frontend prototype\
**Product:** Aura\
**Implementation scope:** Frontend-only interactive prototype using
deterministic dummy data\
**Audience:** Hackathon mentors, evaluators, and the project team

## 1. Product vision

Aura is a trust-first freelance marketplace that helps hirers discover
workers using evidence-backed CV claims, then reduces hiring risk
through small sample trials, transparent work stages, simulated escrow,
mutual ratings, and a reputation history.

**Core promise:** Hire people whose work you have seen, not just people
who say they can.

Aura combines four ideas: 1. **Verify** --- turn a CV into individual
claims and show the proof status of each claim. 2. **Discover** --- let
hirers browse and compare worker profiles using skills, portfolio
examples, and proof levels. 3. **Try** --- let a hirer request a clearly
scoped, watermarked sample before the main engagement. 4. **Pay and
build reputation** --- demonstrate the lifecycle of escrow, delivery,
reviews, Aura Score, and certificates.

This deliverable is a presentation prototype. It demonstrates the
intended user experience and product logic; it does not provide real
identity verification, payment processing, escrow, email/SMS OTP, or
external platform integrations.

## 2. Problem

Freelance marketplaces can make it difficult to distinguish a strong,
honest profile from an exaggerated or copied one. A public portfolio
link proves that an artifact exists, but not necessarily that the person
claiming it created it or performed the claimed role. Hirers also face
uncertainty about payment and delivery; workers face uncertainty about
whether their time and work will be treated fairly.

Aura makes the evidence and workflow visible. It distinguishes claim
status from skill, account identity, and client relationship; supports
trial previews; and explains the state of each engagement.

## 3. Goals

-   Deliver a coherent, polished, clickable frontend suitable for a live
    mentor demonstration.
-   Demonstrate both the hirer and worker experiences in a single
    application.
-   Make the claim-level proof model and Claim Ring recognizable across
    the experience.
-   Show a complete marketplace journey from discovery through delivery
    and mutual rating.
-   Use consistent dummy records and deterministic state transitions so
    a presenter can reliably demonstrate scenarios.
-   Make simulated behavior transparent in the UI.
-   Keep code organized so a backend can be added later without
    rebuilding the presentation layer from scratch.

## 4. Non-goals for this version

The following are explicitly out of scope: - Real backend, server, API,
or database. - Real account creation or authentication. - Real OTP
delivery or verification. - Real DigiLocker, university, employer,
GitHub, Behance, LinkedIn, GST, or other provider checks. - Real file
upload, CV parsing, AI inference, authorship detection, or plagiarism
detection. - Real payments, bank/UPI/card processing, escrow, refunds,
or payout. - Real email invitations or client attestations. - Production
Aura Score calculations, anti-fraud decisions, or legal identity
assurance. - Production deployment hardening or guarantees of production
readiness.

Any action that imitates one of these capabilities must be visibly
labelled as simulated or demo-only. Never show fabricated results as
real provider verification.

## 5. Users and roles

### 5.1 Hirer

A person or studio that wants to find, compare, shortlist, trial, hire,
and review freelance workers.

Primary needs: - Search by work category or brief. - Understand why a
worker is a match. - Inspect individual claims and their proof
statuses. - Compare candidates without relying on unsupported ranking
badges. - Post a brief, review bids, accept or reject sample trials, and
walk through the simulated gig lifecycle. - Understand the simulated
escrow ledger and final certificate.

### 5.2 Worker

A freelancer or studio that wants to present a credible profile, submit
evidence for claims, bid on briefs, deliver work, and build a
reputation.

Primary needs: - Set up a profile and select work interests. -
Review/edit sample CV claims and attach illustrative proof links. - See
the difference between Verified, Partially verified, Self-declared, and
Disproved. - Preview an Aura Score and Claim Ring. - Browse bids, submit
a proposal, deliver a sample, and see ratings/certificates.

### 5.3 Mentor/evaluator

A person evaluating the product demo. The evaluator needs to inspect
both roles and move the prototype through important scenarios without
waiting for external services.

Primary needs: - Switch demo persona. - Advance simulated time. - open
the review desk for a dispute scenario. - Reset all demo state to a
known starting point. - Understand what is simulated.

## 6. Product principles

-   **Claim-level, not profile-level:** each claim has its own evidence
    status.
-   **Evidence is not attribution:** a link's existence alone does not
    prove who created the work.
-   **Explain trust:** show why a claim is in a given state.
-   **No false certainty:** missing evidence is not proof of fraud;
    self-declared is not the same as disproved.
-   **Fairness on both sides:** the hirer and worker both have trust
    context.
-   **Try before the main payment:** the sample is limited and visibly
    watermarked/unpaid.
-   **Honest prototype:** any simulated external verification or money
    movement is labelled.
-   **No dead controls:** every visible primary or secondary action
    should navigate, update demo state, open a relevant panel, or be
    clearly disabled with a reason.

## 7. Claim proof model

Each CV claim has a type, text, proof status, evidence summary, and
method label.

Statuses: - **Verified** --- in this prototype, a seeded demo record
represents a strong proof outcome. It is not a real verification. -
**Partially verified** --- evidence exists or appears consistent, but
attribution/ownership or another critical component is not confirmed. -
**Self-declared** --- the worker has entered the claim but has not
supplied adequate proof. - **Disproved** --- a demo-only negative
outcome used to demonstrate how an explicitly contradicted claim would
appear. Do not infer this status merely because evidence is missing.

Claims may relate to education, employment, skills, project delivery,
client relationships, credentials, or portfolio authorship. For a
creative-work claim, the UI should separate: (1) artifact exists, (2)
worker's contribution/role, and (3) client or project relationship.
Evidence examples may include source-project history, independent
client/collaborator confirmation, contribution records, or a practical
skills assessment. In this frontend-only demo, these are explanatory
examples, not live checks.

## 8. Core user journeys

### 8.1 Landing and role selection

1.  Open the landing page.
2.  Read the promise and see the live-looking component collage.
3.  Choose "I want to hire" or "I want to work".
4.  Continue into the role-specific onboarding path.
5.  Reach the role-specific workspace.

### 8.2 Hirer onboarding

1.  Choose Individual or Studio.
2.  Complete demo fields for mobile, email, identity, and payment
    method.
3.  View simulated status changes and a clear prototype label.
4.  For Studio, show business name, GSTIN, business email, and
    authorised signatory.
5.  If a demo GSTIN triggers review, show the "Account under review"
    state and explain why the user cannot continue.
6.  Continue to interest/search experience when demo checks are
    complete.

### 8.3 Worker onboarding and CV

1.  Choose Individual or Studio.
2.  Complete demo contact and payout fields.
3.  Select work interests from exactly seven categories: Vibecoding, Web
    Development, Video Editing, Software, Architecture Design, Social
    Media Marketing, Design & Graphics.
4.  Open My CV.
5.  See a mock CV upload/parser flow and seeded claims. No file is
    uploaded or parsed by a real service.
6.  Edit a claim, add a proof URL, view demo verification options, or
    delete a claim.
7.  Review the Claim Ring, claim count, Aura Score preview, and signed
    declaration.
8.  The "Go live in discovery" action remains disabled until the demo
    declaration is signed; after signing, the demo profile can be marked
    live.

### 8.4 Hirer discovery

1.  Enter search from the landing page or navigation.
2.  Search by category, keywords, or suggested prompts.
3.  Browse worker cards in Deck, List, or Compare mode.
4.  Swipe or use Skip, Priority, Shortlist, Undo, and Open profile.
5.  Inspect the Claim Ring, proof statuses, skills, rate, rating,
    completed gigs, and match explanation.
6.  Open a worker profile and inspect claims, portfolio, ratings,
    declaration, and trust summary.
7.  Shortlist a worker and navigate to Post brief.

### 8.5 Post brief and shortlist

1.  Open Shortlist.
2.  Choose workers to invite.
3.  Create a brief with title, deliverables, budget range, deadline, and
    trial scope.
4.  Keep trial scope small and explicit; the UI states that workers
    should not be asked to complete unpaid production work.
5.  Post the brief and show the selected invitees in the demo state.
6.  View incoming bids in My gigs or the hirer dashboard.

### 8.6 Worker bidding

1.  Open worker Dashboard or Bids.
2.  Browse available briefs.
3.  Open a bid detail page.
4.  Review the brief, deliverables, trial scope, budget and hirer trust
    facts.
5.  Enter price, timeline and approach.
6.  Submit the bid and see a confirmation in demo state.

### 8.7 Gig lifecycle

The workspace shows a six-stage stepper: 1. Bidding 2. Trial 3. Escrow
4. Delivery 5. Review 6. Rating

A demo gig can move through these states: - Bidding: bids and
shortlisted candidates. - Trial: watermarked sample preview;
accept/reject with a reason. - Awaiting escrow / Escrow: show a
simulated ledger with agreed amount, 8% platform fee, worker net amount,
and payment status. - In progress: worker sees upload/notes controls;
hirer sees due date and progress. - Delivered: hirer can simulate
approval/release or raise a dispute. - Disputed: show both sides'
evidence notes and a review-desk decision. - Released / Refunded /
Split: show the outcome clearly. - Review and Rating: both sides submit
a demo rating; reveal logic may be simulated. - Completion: show a
certificate card with demo code and QR representation.

All money movement is simulated and must say so.

### 8.8 Worker dashboard

Show: - Claim Ring and Aura Score/level. - Claims verified count. -
Streak tracker with an 11-step target. - 12-week activity heatmap. -
Recent bids and gig status. - Recent activity and a clear next action.

### 8.9 Hirer dashboard

Show: - Active, accepted, rejected, and completed gig counts in one
connected four-cell strip. - Favourite workers. - Gigs table with
status, budget, deadline, and next action. - Filters driven by the
selected summary cell. - No Aura Score or worker-level ranking module on
the hirer dashboard.

### 8.10 Certificate verification

1.  Open a demo certificate.
2.  Copy the demo link or download/render an image if supported.
3.  Open `#/verify/:code`.
4.  For a seeded valid code, show certificate details and a "genuine in
    this demo dataset" explanation.
5.  For an unknown code, show a clear not-found state.
6.  Do not imply that the demo code is cryptographically or externally
    verified.

### 8.11 Account and "How Aura works"

Account sections: Profile, Verification, Payments, Notifications, and
Reset this demo. "How Aura works" explains claim verification,
trials/escrow, ratings/Aura Score, and what is simulated. Include a
feature table with prototype behavior vs intended production mechanism.

### 8.12 Evaluator tools

A clearly separate dark Demo Bar lets the presenter: - Switch between
seeded demo personas (hirers and workers). - Advance simulated date by
+1, +3, or +5 days. - Open Aura Review Desk when a gig is disputed and
choose release, refund, or split 50/50. - Reset the demo to initial seed
state. On mobile it collapses into a floating pill and bottom sheet. It
must not be confused with the product's normal navigation.

## 9. Required screens

1.  Landing
2.  Role-specific onboarding and demo verification
3.  Work interests selection
4.  Hirer search/discovery --- Deck, List, Compare
5.  Worker public profile
6.  Shortlist
7.  Post brief
8.  Hirer dashboard
9.  Worker dashboard
10. Worker CV and claims
11. Bids list and bid detail
12. Gig workspace covering all stages
13. Trial preview and accept/reject
14. Simulated escrow ledger
15. Delivery, approval, dispute and review desk
16. Mutual ratings
17. Certificate view and certificate verification
18. Account settings
19. How Aura works / prototype disclosures
20. Evaluator Demo Bar and reset flow
21. Useful empty, loading, disabled, error, and not-found states

## 10. Data and demo behavior

-   Use local, deterministic mock data for personas, claims, evidence,
    workers, hirers, briefs, bids, gigs, ratings, certificates, and
    activity.
-   Use a typed data model and separate seed data from UI components.
-   Use stable IDs and deterministic avatar/portfolio thumbnail
    generation.
-   State changes should be local to the browser session or local
    storage if persistence is needed for the presentation.
-   Reset must restore the documented initial demo scenario.
-   No real user data, credentials, identity documents, payment details,
    or secrets should be collected.
-   All simulated timestamps should derive from a demo clock, not be
    scattered hard-coded across components.

## 11. Success criteria

The frontend presentation is acceptable when: - Every required screen is
reachable from a real navigation or action. - Both roles can be
demonstrated without reloading or editing source code. - Key claim
statuses are shown consistently. - Deck, list and compare modes operate
on the same seeded worker data. - Briefs, bids, trial decisions, gig
states, review outcomes and ratings update coherently. - Demo Bar
persona/time/reset tools work predictably. - The prototype labels
simulated verification and payment behavior honestly. - Responsive
desktop and mobile layouts are usable. - The main workflows have
automated tests and have been manually rehearsed. - The README explains
how to run the frontend and how to perform the mentor demo.

## 12. Acceptance and release boundary

This is a **frontend presentation prototype**, not a production
marketplace. A passing build or polished screen does not imply real
verification, secure account handling, or real escrow. Future backend
work requires a separate architecture and security review.
