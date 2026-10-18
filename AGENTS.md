# Instructions for Codex --- Aura

## Mission

Build Aura from scratch as a polished, interactive **frontend-only
presentation prototype** for mentor evaluation. Use deterministic dummy
data. The existing demo prototype is a reference only; do not copy its
implementation into this clean workspace unless the user explicitly
approves a specific file.

## Source-of-truth order

1.  `PRD.md` defines product behavior, scope and acceptance criteria.
2.  `DESIGN.md` defines visual design, screen layouts, components,
    motion and responsive behavior.
3.  `DECISIONS.md` records approved technology and architecture choices.
4.  `TASKS.md` defines the implementation order and verified progress.
5.  This file defines how you must work.

If a requirement is ambiguous and materially affects scope or
architecture, ask the user. Do not silently invent product behavior.

## Scope boundaries

-   Frontend only for this phase. No production backend, database, real
    authentication, real identity checks, real OTP, real
    payments/escrow, real CV parsing, or live provider integration.
-   All data is dummy data. Use deterministic seeded records with stable
    IDs.
-   Every simulated verification, payment, OTP, certificate and provider
    interaction must be visibly labelled as simulated/demo-only.
-   Do not request or store real identity documents, passwords, card/UPI
    details, or sensitive personal data.
-   Do not claim that a portfolio link or metadata proves authorship.
    Distinguish artifact existence from contribution/attribution and
    client relationship.
-   Do not represent absence of evidence as fraud or as a Disproved
    claim.
-   Keep the architecture simple and maintain clear boundaries so a
    backend can be added in a later phase.
-   Do not add features beyond the approved PRD without asking.

## Working method

1.  Inspect the current workspace and relevant files before editing.
2.  Work in small, dependency-ordered tasks from `TASKS.md`.
3.  Before each task, state its goal and acceptance criteria when
    useful.
4.  Implement the smallest complete feature, including relevant UI
    states and tests.
5.  Run the relevant checks and observe the output before reporting
    success.
6.  Fix failures and rerun checks.
7.  Update `TASKS.md` only after verifying completion; never mark a task
    complete based only on generated code.
8.  At task boundaries, report files changed, behavior implemented,
    commands run, results and known limitations.
9.  If interrupted, record the exact next task, relevant context and
    outstanding failures in `TASKS.md`.
10. Preserve existing working code in the new project. Do not replace
    large areas merely for stylistic preference.

## Code quality

-   Use the approved TypeScript/React stack.
-   Prefer small, typed components and explicit domain types.
-   Keep mock seed data separate from components.
-   Keep data operations behind typed mock-service/repository functions.
-   Use Context + reducer only for shared cross-page demo state; use
    local component state for local UI state.
-   Use centralized design tokens; avoid arbitrary color values and
    one-off spacing.
-   Use Lucide icons, not emoji as interface icons.
-   Every visible control must navigate, update demo state, open a
    relevant panel, copy/download as specified, or be disabled with a
    clear explanation. Avoid dead buttons.
-   Forms require labels, validation, helper text and clear error
    messages.
-   Include loading, empty, error, success, disabled and confirmation
    states where appropriate.
-   Maintain desktop and mobile layouts, keyboard navigation, visible
    focus and reduced-motion behavior.
-   Use deterministic avatar/portfolio generators so seeded identities
    look consistent.
-   Do not add dependencies without a concrete need and a brief
    explanation.

## Testing and honesty

-   Use the tests and scripts defined by the project.
-   Add tests for shared components, state transitions and core user
    journeys.
-   Run tests, type-check, lint and build when applicable.
-   Report exact commands and actual results.
-   Never claim tests, builds, accessibility checks, browser behavior or
    external integrations succeeded unless they were actually verified.
-   If a check cannot be run, label it NOT TESTED and explain why.
-   Do not hide failing tests or downgrade acceptance criteria to make
    the report look successful.
-   Do not call a mock integration "real", and do not claim production
    readiness.

## Security and privacy

-   Never place secrets in source code or documentation.
-   Do not create `.env` with real credentials. If required, create
    `.env.example` with safe placeholders only.
-   No real authentication, payments, identity-provider connections or
    external data calls in this phase.
-   Avoid collecting sensitive data in demo forms; use clearly fake
    example values.
-   Treat client-side route guards as demo navigation, not security
    controls.
-   Keep dependency choices minimal and review package scripts before
    executing unfamiliar commands.

## Git and repository restrictions

During implementation, do not run: - `git init` - `git add` -
`git commit` - `git push` - remote repository operations or branch
management

The team will coordinate Git setup and code ownership after the local
frontend is implemented and tested. Do not perform Git operations unless
the user explicitly changes this instruction.

## Completion reporting

For each milestone, provide: - Tasks completed and relevant files. -
User-visible behavior. - Tests/checks actually run and their results. -
Known issues, assumptions and untested areas. - Next recommended task.

For final handoff, compare the implementation against every PRD
acceptance criterion and report PASS, FAIL, BLOCKED or NOT TESTED.
Include local run/test instructions, mock-data disclosures and a clear
list of remaining work.
