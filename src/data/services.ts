import { createSeed, ledger, personas, seedClaims } from "./seed";
import {
  categories,
  type Action,
  type DemoState,
  type Gig,
  type Role,
} from "./types";
export const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
export const dateLabel = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
export const addDays = (date: string, days: number) => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
export const personaService = {
  current: (s: DemoState) => personas.find((p) => p.id === s.personaId)!,
};
export const workerService = {
  get: (s: DemoState, id: string) => s.workers.find((w) => w.id === id),
  search: (s: DemoState, query: string, category: string) =>
    s.workers.filter(
      (w) =>
        w.live &&
        (!category || w.category === category) &&
        `${w.name} ${w.category} ${w.skills.join(" ")} ${w.city}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    ),
};
export const claimService = {
  forWorker: (s: DemoState, id: string) =>
    s.claims.filter((c) => c.workerId === id),
};
export const briefService = {
  available: (s: DemoState) =>
    s.briefs.filter(
      (b) =>
        s.gigs.some((g) => g.briefId === b.id && g.status === "Bidding") &&
        (!b.invitees.length || b.invitees.includes(s.personaId)),
    ),
  get: (s: DemoState, id: string) => s.briefs.find((b) => b.id === id),
};
export const gigService = {
  forPersona: (s: DemoState) =>
    s.gigs.filter((g) =>
      personaService.current(s).role === "hirer"
        ? g.hirerId === s.personaId
        : g.workerId === s.personaId ||
          s.bids.some(
            (b) => b.briefId === g.briefId && b.workerId === s.personaId,
          ),
    ),
  get: (s: DemoState, id: string) => s.gigs.find((g) => g.id === id),
  stage: (g: Gig) =>
    ({
      Bidding: 0,
      Trial: 1,
      "Awaiting escrow": 2,
      "In progress": 3,
      Delivered: 4,
      Disputed: 4,
      Released: 5,
      Refunded: 5,
      Split: 5,
      Completed: 5,
    })[g.status],
  ratingsVisible: (s: DemoState, g: Gig) =>
    g.ratings.length === 2 ||
    (!!g.outcomeAt && s.clock.date >= addDays(g.outcomeAt, 3)),
};
export const certificateService = {
  lookup: (s: DemoState, code: string) =>
    s.certificates.find((c) => c.code === code),
};
export const verificationService = {
  gst: (value: string) =>
    value === "DEMO-REVIEW"
      ? "review"
      : value === "DEMO-GST-OK"
        ? "passed"
        : "invalid",
  otp: (value: string) => value === "123456",
};
function requireThat(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function checkRole(s: DemoState, role: Role) {
  requireThat(
    personaService.current(s).role === role,
    `Switch to a ${role} demo persona to use this action.`,
  );
}
function ownedGig(s: DemoState, id: string, role?: Role) {
  const g = gigService.get(s, id);
  requireThat(g, "This gig was not found.");
  if (role) {
    checkRole(s, role);
    requireThat(
      (role === "hirer" ? g.hirerId : g.workerId) === s.personaId,
      "Switch to the persona assigned to this gig.",
    );
  }
  return g;
}
function stage(g: Gig, allowed: Gig["status"][]) {
  requireThat(
    allowed.includes(g.status),
    "This action is unavailable at the current gig stage.",
  );
}
function ownClaim(s: DemoState, id: string) {
  checkRole(s, "worker");
  const c = s.claims.find((c) => c.id === id && c.workerId === s.personaId);
  requireThat(c, "This claim does not belong to the current worker.");
  return c;
}
function outcome(
  s: DemoState,
  g: Gig,
  result: "Released" | "Refunded" | "Split",
) {
  g.status = result;
  g.outcome = result;
  g.outcomeAt = s.clock.date;
  // The 8% fee applies to the portion released; refunded money carries no fee.
  const released =
    result === "Released"
      ? g.ledger.amount
      : result === "Split"
        ? g.ledger.amount / 2
        : 0;
  g.ledger.feeCollected = Math.round(released * 0.08);
  g.ledger.workerPaid = released - g.ledger.feeCollected;
  g.ledger.hirerRefund = g.ledger.amount - released;
  g.ledger.events.push({
    date: s.clock.date,
    text: `Simulated ${result.toLowerCase()}: ${money(g.ledger.workerPaid)} to worker; ${money(g.ledger.hirerRefund)} refunded; ${money(g.ledger.feeCollected)} fee`,
  });
}
export function applyAction(state: DemoState, action: Action): DemoState {
  if (action.type === "RESET") return createSeed();
  const s = structuredClone(state);
  s.serial++;
  let message = "";
  switch (action.type) {
    case "NOTICE":
      s.notice = { text: action.text, error: !!action.error, serial: s.serial };
      return s;
    case "SWITCH":
      requireThat(
        personas.some((p) => p.id === action.id),
        "Unknown demo persona.",
      );
      s.personaId = action.id;
      message = `Now viewing as ${personaService.current(s).name}`;
      break;
    case "ADVANCE":
      requireThat([1, 3, 5].includes(action.days), "Choose 1, 3 or 5 days.");
      s.clock.date = addDays(s.clock.date, action.days);
      message = `Demo date is now ${dateLabel(s.clock.date)}. Deadlines and rating reveal timing updated.`;
      break;
    case "SHORTLIST": {
      checkRole(s, "hirer");
      requireThat(workerService.get(s, action.workerId), "Worker not found.");
      const list = (s.shortlist[s.personaId] ||= []);
      const priorities = (s.priority[s.personaId] ||= []);
      if (action.mode === "remove") {
        s.shortlist[s.personaId] = list.filter((id) => id !== action.workerId);
        s.priority[s.personaId] = priorities.filter(
          (id) => id !== action.workerId,
        );
        message = "Worker removed from shortlist.";
      } else {
        if (!list.includes(action.workerId)) list.push(action.workerId);
        if (action.mode === "priority" && !priorities.includes(action.workerId))
          priorities.push(action.workerId);
        message =
          action.mode === "priority"
            ? "Worker prioritised and shortlisted."
            : "Worker added to your shortlist.";
      }
      break;
    }
    case "RESTORE_SHORTLIST":
      checkRole(s, "hirer");
      s.shortlist[s.personaId] = action.ids;
      s.priority[s.personaId] = action.priorities;
      message = "Last discovery action undone.";
      break;
    case "ONBOARD":
      s.onboarding[s.personaId] = true;
      s.accountTypes[s.personaId] =
        action.accountType || personaService.current(s).accountType;
      message = "Demo checks complete. No provider was contacted.";
      break;
    case "INTERESTS": {
      requireThat(
        action.interests.length > 0 &&
          action.interests.every((c) => categories.includes(c)),
        "Choose at least one work category.",
      );
      const w = workerService.get(s, s.personaId);
      if (w) w.interests = action.interests;
      message = "Interests saved for this demo session.";
      break;
    }
    case "PROFILE": {
      requireThat(
        action.name.trim().length >= 2,
        "Enter a display name with at least two characters.",
      );
      const p =
        workerService.get(s, s.personaId) ||
        s.hirers.find((h) => h.id === s.personaId);
      requireThat(p, "Profile not found.");
      p.name = action.name.trim();
      if ("city" in p && action.city) p.city = action.city;
      message = "Demo profile updated.";
      break;
    }
    case "NOTIFICATIONS":
      s.notifications[s.personaId] = action.enabled;
      message = "Demo notification preference saved. No messages are sent.";
      break;
    case "EDIT_CLAIM": {
      const c = ownClaim(s, action.id);
      requireThat(
        action.text.trim().length >= 10,
        "Describe the claim in at least 10 characters.",
      );
      c.text = action.text.trim();
      c.status = "Self-declared";
      c.method = "Edited claim; previous demo outcome no longer applies";
      c.date = s.clock.date;
      c.evidence = {
        id: c.evidence.id,
        artifact: "Not rechecked after edit",
        contribution: "Not confirmed",
        relationship: "Not confirmed",
      };
      message =
        "Claim updated. Its proof status has been reset to Self-declared.";
      break;
    }
    case "DELETE_CLAIM":
      ownClaim(s, action.id);
      s.claims = s.claims.filter((c) => c.id !== action.id);
      message = "Claim deleted from this demo session.";
      break;
    case "PROOF": {
      const c = ownClaim(s, action.id);
      const url = new URL(action.url);
      requireThat(
        ["https:", "http:"].includes(url.protocol),
        "Use a valid http or https proof URL.",
      );
      c.evidence.url = url.href;
      c.evidence.artifact = "Illustrative URL supplied; not fetched or checked";
      if (c.status !== "Disproved") c.status = "Partially verified";
      c.method =
        "Demo link attached; authorship and client relationship remain unconfirmed";
      c.date = s.clock.date;
      message = "Illustrative proof link attached. No external check was made.";
      break;
    }
    case "VERIFY_CLAIM": {
      const c = ownClaim(s, action.id);
      requireThat(
        [
          "DigiLocker credential",
          "Account ownership",
          "Client confirmation",
        ].includes(action.method),
        "Choose a demo verification method.",
      );
      if (c.status === "Disproved") {
        message =
          "Seeded contradiction remains. Adding evidence does not erase it.";
        break;
      }
      const strong =
        (action.method === "DigiLocker credential" && c.type === "Education") ||
        (action.method === "Client confirmation" && c.type === "Project");
      c.status = strong ? "Verified" : "Partially verified";
      c.method = `Simulated ${action.method.toLowerCase()} — no provider contacted`;
      c.date = s.clock.date;
      c.evidence.artifact = "Seeded artifact exists";
      c.evidence.contribution = strong
        ? "Seeded independent contribution confirmation"
        : "Not confirmed by account ownership alone";
      c.evidence.relationship = strong
        ? "Seeded independent relationship confirmation"
        : "Not confirmed";
      message = "Simulated verification outcome applied.";
      break;
    }
    case "PARSE":
      checkRole(s, "worker");
      s.claims = [
        ...s.claims.filter((c) => c.workerId !== s.personaId),
        ...seedClaims(s.personaId).map((c) => ({ ...c, date: s.clock.date })),
      ];
      message = "Sample CV loaded. No file was read, uploaded or parsed.";
      break;
    case "DECLARE": {
      const w = workerService.get(s, s.personaId);
      requireThat(w, "Switch to a worker persona.");
      w.declaration = action.signed;
      if (!action.signed) w.live = false;
      message = action.signed
        ? "Demo declaration signed."
        : "Declaration withdrawn; profile is no longer live.";
      break;
    }
    case "LIVE": {
      const w = workerService.get(s, s.personaId);
      requireThat(
        w?.declaration,
        "Sign the demo declaration before going live.",
      );
      w.live = true;
      message = "Demo profile is live in discovery.";
      break;
    }
    case "BRIEF": {
      checkRole(s, "hirer");
      const b = action.brief;
      requireThat(
        b.title.trim().length >= 5 &&
          b.deliverables.trim().length >= 15 &&
          b.trialScope.trim().length >= 15,
        "Add a title, clear deliverables and a small trial scope.",
      );
      requireThat(
        Number.isFinite(b.min) &&
          Number.isFinite(b.max) &&
          b.min > 0 &&
          b.max >= b.min,
        "Budget maximum must be at least the positive minimum.",
      );
      requireThat(
        /^\d{4}-\d{2}-\d{2}$/.test(b.deadline) && b.deadline > s.clock.date,
        "Choose a deadline after the demo date.",
      );
      requireThat(
        b.invitees.every((id) => workerService.get(s, id)),
        "Choose existing demo workers.",
      );
      const id = `b${s.serial}`;
      s.briefs.push({
        ...b,
        id,
        hirerId: s.personaId,
        createdAt: s.clock.date,
      });
      s.gigs.push({
        id: `g${s.serial}`,
        briefId: id,
        hirerId: s.personaId,
        status: "Bidding",
        trial: { submitted: false, note: "" },
        ledger: ledger(b.max),
        deliveryNote: "",
        ratings: [],
      });
      message =
        "Brief posted. Invitations are simulated and visible to the selected workers.";
      break;
    }
    case "BID": {
      checkRole(s, "worker");
      const b = briefService.available(s).find((b) => b.id === action.briefId);
      requireThat(b, "This brief is not open to this worker.");
      requireThat(
        !s.bids.some(
          (bid) =>
            bid.briefId === b.id &&
            bid.workerId === s.personaId &&
            bid.status !== "Rejected",
        ),
        "You already have a bid on this brief.",
      );
      requireThat(
        Number.isFinite(action.price) &&
          action.price >= b.min &&
          action.price <= b.max &&
          Number.isInteger(action.days) &&
          action.days > 0 &&
          addDays(s.clock.date, action.days) <= b.deadline &&
          action.approach.trim().length >= 20,
        "Use a price within budget, a timeline before the deadline, and at least 20 characters for your approach.",
      );
      s.bids.push({
        id: `bid${s.serial}`,
        briefId: b.id,
        workerId: s.personaId,
        price: action.price,
        days: action.days,
        approach: action.approach.trim(),
        status: "Pending",
        createdAt: s.clock.date,
      });
      message = "Proposal sent to the hirer in this demo.";
      break;
    }
    case "SELECT_BID": {
      const g = ownedGig(s, action.gigId, "hirer");
      stage(g, ["Bidding"]);
      const b = s.bids.find(
        (b) =>
          b.id === action.bidId &&
          b.briefId === g.briefId &&
          b.status === "Pending",
      );
      requireThat(b, "Choose a pending bid for this gig.");
      b.status = "Selected";
      g.workerId = b.workerId;
      g.status = "Trial";
      g.ledger = ledger(b.price);
      g.trial = { submitted: false, note: "" };
      message =
        "Trial requested. Switch to the selected worker to send a sample.";
      break;
    }
    case "TRIAL_UPLOAD": {
      const g = ownedGig(s, action.gigId, "worker");
      stage(g, ["Trial"]);
      requireThat(
        action.note.trim().length >= 10,
        "Describe the sample in at least 10 characters.",
      );
      g.trial.submitted = true;
      g.trial.note = action.note.trim();
      message = "Watermarked demo sample delivered.";
      break;
    }
    case "TRIAL_DECISION": {
      const g = ownedGig(s, action.gigId, "hirer");
      stage(g, ["Trial"]);
      requireThat(
        g.trial.submitted,
        "Wait for a demo sample before reviewing.",
      );
      if (action.accept) {
        g.trial.decision = "Accepted";
        s.hirers.find((h) => h.id === g.hirerId)!.acceptedTrials++;
        g.status = "Awaiting escrow";
        message = "Trial accepted. Review and fund the simulated escrow.";
      } else {
        requireThat(
          [
            "Off-brief",
            "Quality below brief",
            "Not my style",
            "Other",
          ].includes(action.reason || ""),
          "Choose a rejection reason.",
        );
        g.trial.decision = "Rejected";
        g.trial.reason = action.reason;
        s.bids
          .filter((b) => b.briefId === g.briefId && b.status === "Selected")
          .forEach((b) => {
            b.status = "Rejected";
          });
        g.status = "Bidding";
        g.workerId = undefined;
        message =
          "Trial rejected with a reason. The brief is open for bids again.";
      }
      break;
    }
    case "FUND": {
      const g = ownedGig(s, action.gigId, "hirer");
      stage(g, ["Awaiting escrow"]);
      g.ledger.funded = true;
      g.ledger.events.push({
        date: s.clock.date,
        text: "Demo escrow funded; no money moved",
      });
      g.status = "In progress";
      message = "Simulated escrow funded. The worker can now deliver.";
      break;
    }
    case "DELIVER": {
      const g = ownedGig(s, action.gigId, "worker");
      stage(g, ["In progress"]);
      requireThat(
        action.note.trim().length >= 10,
        "Include a delivery note of at least 10 characters.",
      );
      g.deliveryNote = action.note.trim();
      g.deliveredAt = s.clock.date;
      g.status = "Delivered";
      message = "Demo delivery sent for review.";
      break;
    }
    case "RELEASE": {
      const g = ownedGig(s, action.gigId, "hirer");
      stage(g, ["Delivered"]);
      outcome(s, g, "Released");
      message = "Delivery approved and simulated funds released.";
      break;
    }
    case "DISPUTE": {
      const g = ownedGig(s, action.gigId, "hirer");
      stage(g, ["Delivered"]);
      requireThat(
        action.note.trim().length >= 10,
        "Explain the issue in at least 10 characters.",
      );
      g.dispute = { hirerNote: action.note.trim(), workerNote: "" };
      g.status = "Disputed";
      message = "Demo dispute opened. Funds are simulated as frozen.";
      break;
    }
    case "EVIDENCE": {
      const g = ownedGig(s, action.gigId, "worker");
      stage(g, ["Disputed"]);
      requireThat(
        g.dispute && action.note.trim().length >= 10,
        "Add an evidence note of at least 10 characters.",
      );
      g.dispute.workerNote = action.note.trim();
      message = "Worker evidence added to the review desk.";
      break;
    }
    case "RESOLVE": {
      const g = ownedGig(s, action.gigId);
      stage(g, ["Disputed"]);
      requireThat(g.dispute, "No dispute exists.");
      g.dispute.decision = `Evaluator decision: ${action.outcome}`;
      outcome(s, g, action.outcome);
      message = `Demo dispute resolved: ${action.outcome.toLowerCase()}.`;
      break;
    }
    case "RATE": {
      const role = personaService.current(s).role;
      const g = ownedGig(s, action.gigId, role);
      stage(g, ["Released", "Refunded", "Split"]);
      requireThat(
        !g.ratings.some((r) => r.by === role),
        "You have already rated this engagement.",
      );
      requireThat(
        action.scores.length === 3 &&
          action.scores.every((n) => Number.isInteger(n) && n >= 1 && n <= 5),
        "Rate each of the three criteria.",
      );
      const extreme = action.scores.some((n) => n <= 2 || n === 5);
      requireThat(
        action.note.length <= 140 &&
          (!extreme || action.note.trim().length >= 10),
        "Ratings of 1–2 or 5 require a 10–140 character explanation.",
      );
      g.ratings.push({
        by: role,
        scores: action.scores,
        note: action.note.trim(),
        date: s.clock.date,
        flagged: false,
      });
      if (g.ratings.length === 2) {
        g.status = "Completed";
        if (g.outcome === "Released" && g.workerId) {
          s.certificates.push({
            code: `AURA-2026-${String(s.serial).padStart(4, "0")}`,
            gigId: g.id,
            workerId: g.workerId,
            hirerId: g.hirerId,
            title: briefService.get(s, g.briefId)!.title,
            issuedAt: s.clock.date,
            outcome: "Simulated escrow released in full",
          });
          const w = workerService.get(s, g.workerId)!;
          const received = g.ratings.find((r) => r.by === "hirer")!;
          const newRating = received.scores.reduce((a, b) => a + b, 0) / 3;
          w.rating =
            Math.round(
              ((w.rating * w.ratingCount + newRating) / (w.ratingCount + 1)) *
                10,
            ) / 10;
          w.ratingCount++;
          w.completedGigs++;
          const h = s.hirers.find((h) => h.id === g.hirerId)!;
          const hirerRating =
            g.ratings
              .find((r) => r.by === "worker")!
              .scores.reduce((a, b) => a + b, 0) / 3;
          h.rating =
            Math.round(
              ((h.rating * h.completedGigs + hirerRating) /
                (h.completedGigs + 1)) *
                10,
            ) / 10;
          h.completedGigs++;
          w.earned += g.ledger.workerPaid;
          w.score = Math.min(100, w.score + 2);
          w.streak = Math.min(11, w.streak + 1);
        }
      }
      message =
        g.status === "Completed"
          ? "Both ratings saved. Engagement completed."
          : "Rating saved. It reveals when both sides rate or after 3 demo days.";
      break;
    }
    case "FLAG": {
      const g = ownedGig(s, action.gigId, personaService.current(s).role);
      requireThat(
        gigService.ratingsVisible(s, g),
        "Ratings are still private.",
      );
      requireThat(
        action.by !== personaService.current(s).role,
        "Only the other party’s rating can be flagged.",
      );
      const r = g.ratings.find((r) => r.by === action.by);
      requireThat(r, "Rating not found.");
      r.flagged = true;
      message =
        "Demo appeal recorded locally. No external moderation request was sent.";
      break;
    }
  }
  if (message) {
    s.notice = { text: message, error: false, serial: s.serial };
    if (!["SWITCH", "NOTICE", "ADVANCE"].includes(action.type))
      s.activity.unshift({
        id: `a${s.serial}`,
        personaId: s.personaId,
        text: message,
        date: s.clock.date,
      });
  }
  return s;
}
