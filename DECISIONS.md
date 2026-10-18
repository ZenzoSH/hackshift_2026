# Aura --- Architecture and Product Decisions

**Scope:** New implementation from scratch, frontend-first, local dummy
data for mentor presentation.\
**Decision status:** Proposed baseline; revisit only when a documented
requirement needs a change.

## D-001 --- Frontend-only presentation prototype

**Decision:** Build an interactive frontend with seeded dummy data. Do
not build a production backend or database in this phase.

**Reason:** The immediate goal is a reliable mentor demonstration of the
product concept and user journeys.

**Consequences:** - Data operations are local mock functions and
client-side state transitions. - The UI must label simulated OTP,
identity checks, provider integrations, CV parsing, payments, escrow,
and verification. - Do not collect real sensitive information. - The
architecture should keep data access behind a small mock-service layer
so a backend can replace it later.

## D-002 --- No reuse of the old prototype implementation

**Decision:** Start in a clean workspace. Use prior prototype and
documentation only as product/design references.

**Reason:** Avoid inheriting accidental architecture, broken code, or
prototype-specific constraints.

**Consequences:** Build fresh scaffold, tests and component system.
Reuse validated requirements, labels and visual patterns, not source
code unless separately approved.

## D-003 --- Stack baseline

**Proposed stack:** React 18, Vite, TypeScript, Tailwind CSS, React
Router with `HashRouter`, React Context plus `useReducer` for shared
demo state, localStorage only for demo persistence where useful, Framer
Motion for purposeful motion, `lucide-react` for icons, `qrcode.react`
for demo QR codes, Vitest and React Testing Library.

**Reason:** Lightweight, familiar, quick to develop and suitable for a
browser-based presentation prototype.

**Constraints:** - Confirm current dependency compatibility when
scaffolding. - Do not add backend packages, database clients, auth SDKs,
payment SDKs, or AI libraries in this phase. - Use typed interfaces for
mock data and service functions. - Avoid overengineering global state;
component state is preferred when state is local.

## D-004 --- Routing

**Decision:** Use React Router with `HashRouter` for the demo.

**Reason:** The app can be hosted as a static frontend without
server-side route rewriting, and certificate verification can use a path
such as `#/verify/:code`.

**Consequences:** Define route constants and role-aware route guards as
client-side presentation logic only. These guards are not security
controls.

## D-005 --- Data and state

**Decision:** Use deterministic seed data and a centralized demo state
model for cross-screen workflows.

**Data entities:** DemoPersona, WorkerProfile, HirerProfile, CVClaim,
EvidenceItem, PortfolioItem, Brief, Bid, Gig, Trial, EscrowLedger,
Rating, Certificate, ActivityEvent and DemoClock.

**State model:** React Context + `useReducer` for global state that must
remain coherent across pages. Use local component state for open menus,
forms and transient UI.

**Persistence:** In-memory state by default. Use localStorage only when
persistence across refresh is helpful for the presentation. The Demo Bar
reset must restore a documented seed state. Avoid storing real personal
information.

## D-006 --- Mock-service boundary

**Decision:** UI components must not contain scattered hard-coded data
or fake API calls. Use typed mock repositories/services such as
`workerService`, `claimService`, `briefService`, `gigService`,
`verificationService`, and `certificateService`.

**Behavior:** Services return deterministic data and update local demo
state. Name and label simulated operations clearly. Keep service
interfaces easy to replace with real API clients in a later phase.

**Constraint:** Do not present a mock service as an actual provider
integration.

## D-007 --- Design authority

**Decision:** `DESIGN.md` incorporates the supplied AURA Design
Architecture and is the visual source of truth. `PRD.md` is the
authority for product behavior and scope.

**Conflict rule:** PRD controls what the prototype does; DESIGN controls
how it looks and moves. If the source design file assumes production
integrations, reinterpret them as clearly labelled simulations for this
presentation scope.

## D-008 --- Proof status semantics

**Decision:** Support four display states: Verified, Partially verified,
Self-declared and Disproved.

**Definitions:** - Verified: a seeded demo outcome representing strong
evidence. - Partially verified: some evidence is present, but
ownership/attribution or another part remains unresolved. -
Self-declared: no adequate proof has been provided. - Disproved: seeded
demo contradiction only; never inferred from missing evidence.

**Reason:** A link proves that an artifact exists, not necessarily who
created it. Identity, skill, attribution and client relationship are
distinct dimensions.

## D-009 --- Aura Score

**Decision:** Show a clearly illustrative, deterministic Aura Score and
level in the prototype.

**Constraint:** Do not imply that a validated scoring model exists. The
formula should be simple and documented in mock data/service logic, or
the value should be seeded. The UI must call it a preview/demo score.

## D-010 --- Payment and escrow

**Decision:** Simulate all payment, escrow, fee, refund, release and
payout behavior in local state.

**Prototype rule:** Display a persistent or contextually clear note such
as "Simulated payment. In production this goes through a payment
gateway."

**Constraint:** No real payment provider, real card/UPI details, or real
transfer of funds.

## D-011 --- Verification and external services

**Decision:** DigiLocker, OTP, GST lookup, GitHub/portfolio account
ownership, client confirmation, employer references and CV parsing are
simulated interactions only.

**Constraint:** Use sample values and visibly identify the outcome as
simulated. Do not use real user documents or imply the provider was
contacted.

## D-012 --- Creative-work attribution

**Decision:** The interface can demonstrate evidence types such as
source-project history, version history, contribution records,
independent client confirmation and practical skills assessment. It does
not determine authorship automatically.

**Reason:** Public URLs and metadata alone cannot establish authorship
with certainty.

**Constraint:** Keep the prototype explanation honest and do not present
duplicate detection or metadata as conclusive proof.

## D-013 --- Generated imagery

**Decision:** Use deterministic, code-generated avatars and
category-specific portfolio thumbnails instead of stock photography or
remote image APIs.

**Reason:** Keeps the demo self-contained and visually consistent.

**Consequences:** Seeded worker IDs should consistently generate the
same avatar palette and thumbnail composition.

## D-014 --- Demo Bar

**Decision:** Provide a separate evaluator-only Demo Bar for persona
switching, simulated date advancement, dispute review and reset.

**Reason:** Mentors need to explore both sides and trigger lifecycle
states without real accounts or time delays.

**Constraint:** Keep the bar visually distinct from the product UI. It
is a demo tool, not a production admin feature.

## D-015 --- Accessibility and responsive behavior

**Decision:** Responsive desktop/mobile layouts, keyboard navigation,
visible focus, reduced-motion support, semantic controls and status
labels with icon plus text are required even in the prototype.

## D-016 --- Testing

**Decision:** Use Vitest and React Testing Library. Add component tests
for shared components, state-transition tests for mock services/reducer,
route tests and end-to-end workflow tests if the chosen test setup
supports them.

**Minimum test journeys:** role selection, CV claim edit/status display,
discovery shortlist, post brief, bid submit, trial accept/reject,
simulated escrow lifecycle, dispute resolution, certificate lookup and
Demo Bar reset.

## D-017 --- No Git operations during implementation

**Decision:** Do not run `git init`, `git add`, `git commit`,
`git push`, or remote repository operations during the build phase.

**Reason:** Team members will coordinate ownership and push code later,
after the local frontend is validated.

**Consequences:** Maintain clear module boundaries, accurate
documentation and reproducible local setup. Git setup is a separate
handoff step.

## D-018 --- Future backend boundary

**Decision:** Future production work is a separate phase requiring a new
backend/database architecture and security review.

**Future considerations, not implemented now:** server-side
authentication/authorization, persistent database, real file storage,
provider integrations, payment/escrow provider, audit logging, rate
limiting, privacy controls, monitoring, deployment and security testing.
