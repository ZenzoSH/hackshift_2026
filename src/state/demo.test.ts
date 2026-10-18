import { describe, expect, it } from "vitest";
import { createSeed } from "../data/seed";
import {
  addDays,
  applyAction,
  certificateService,
  gigService,
  verificationService,
  workerService,
} from "../data/services";
import { demoReducer } from "./DemoContext";
import { categories, type Action, type DemoState } from "../data/types";
function actions(...list: Action[]) {
  return list.reduce(applyAction, createSeed());
}
function send(state: DemoState, ...list: Action[]) {
  return list.reduce(applyAction, state);
}
describe("deterministic demo and discovery", () => {
  it("has stable entities, seven categories and references that resolve", () => {
    const s = createSeed();
    expect(s).toEqual(createSeed());
    expect(categories).toHaveLength(7);
    expect(new Set(s.workers.map((w) => w.category)).size).toBe(7);
    s.gigs.forEach((g) => {
      expect(s.briefs.some((b) => b.id === g.briefId)).toBe(true);
      expect(s.hirers.some((h) => h.id === g.hirerId)).toBe(true);
    });
  });
  it("searches category and keywords using the same worker records", () => {
    const s = createSeed();
    expect(workerService.search(s, "React", "")[0]?.id).toBe("w7");
    expect(
      workerService.search(s, "", "Web Development").map((w) => w.id),
    ).toEqual(["w2"]);
    expect(workerService.search(s, "nonexistent", "")).toEqual([]);
  });
  it("supports shortlist priority, remove and exact undo", () => {
    const initial = createSeed();
    let s = actions({ type: "SHORTLIST", workerId: "w3", mode: "priority" });
    expect(s.shortlist.h1).toContain("w3");
    expect(s.priority.h1).toContain("w3");
    s = send(s, { type: "SHORTLIST", workerId: "w3", mode: "remove" });
    expect(s.priority.h1).not.toContain("w3");
    s = send(s, {
      type: "RESTORE_SHORTLIST",
      ids: initial.shortlist.h1,
      priorities: initial.priority.h1,
    });
    expect(s.shortlist).toEqual(initial.shortlist);
  });
  it("restores every record and the clock on reset", () => {
    const s = actions(
      { type: "ADVANCE", days: 5 },
      { type: "SWITCH", id: "w1" },
      { type: "DELETE_CLAIM", id: "w1-c1" },
      { type: "RESET" },
    );
    expect(s).toEqual(createSeed());
  });
  it("validates sample OTP and both business scenarios", () => {
    expect(verificationService.otp("123456")).toBe(true);
    expect(verificationService.otp("000000")).toBe(false);
    expect(verificationService.gst("DEMO-REVIEW")).toBe("review");
    expect(verificationService.gst("DEMO-GST-OK")).toBe("passed");
    expect(verificationService.gst("real")).toBe("invalid");
  });
});
describe("claim evidence and declaration", () => {
  it("resets edited proof instead of retaining unsupported verification", () => {
    const s = actions(
      { type: "SWITCH", id: "w1" },
      { type: "EDIT_CLAIM", id: "w1-c1", text: "A new sample education claim" },
    );
    const c = s.claims.find((c) => c.id === "w1-c1")!;
    expect(c.status).toBe("Self-declared");
    expect(c.evidence.contribution).toBe("Not confirmed");
  });
  it("does not call missing evidence fraud", () => {
    const s = createSeed();
    expect(s.claims.find((c) => c.id === "w1-c3")?.status).toBe(
      "Self-declared",
    );
    expect(s.claims.find((c) => c.id === "w1-c4")?.method).toContain(
      "contradiction",
    );
  });
  it("treats a URL as partial and never erases a contradiction", () => {
    const s = actions(
      { type: "SWITCH", id: "w1" },
      { type: "PROOF", id: "w1-c3", url: "https://example.test/art" },
      { type: "PROOF", id: "w1-c4", url: "https://example.test/art" },
    );
    expect(s.claims.find((c) => c.id === "w1-c3")?.status).toBe(
      "Partially verified",
    );
    expect(s.claims.find((c) => c.id === "w1-c4")?.status).toBe("Disproved");
  });
  it("keeps account ownership distinct from contribution", () => {
    const s = actions(
      { type: "SWITCH", id: "w1" },
      { type: "VERIFY_CLAIM", id: "w1-c2", method: "Account ownership" },
    );
    expect(s.claims.find((c) => c.id === "w1-c2")?.status).toBe(
      "Partially verified",
    );
  });
  it("gates live status on a signed declaration and withdraws on unsigning", () => {
    let s = actions({ type: "SWITCH", id: "w1" });
    expect(() => applyAction(s, { type: "LIVE" })).toThrow("Sign");
    s = send(s, { type: "DECLARE", signed: true }, { type: "LIVE" });
    expect(s.workers[0].live).toBe(true);
    s = send(s, { type: "DECLARE", signed: false });
    expect(s.workers[0].live).toBe(false);
  });
  it("blocks editing another worker and rejects unsafe URL schemes", () => {
    const s = actions({ type: "SWITCH", id: "w2" });
    expect(() =>
      applyAction(s, { type: "DELETE_CLAIM", id: "w1-c1" }),
    ).toThrow();
    expect(() =>
      applyAction(s, {
        type: "PROOF",
        id: "w2-c1",
        url: "javascript:alert(1)",
      }),
    ).toThrow();
  });
});
describe("brief to completed certificate", () => {
  it("runs a complete invited bid, sample, funding, delivery and mutual rating journey", () => {
    let s = actions({
      type: "BRIEF",
      brief: {
        title: "Demo editorial system",
        deliverables: "A sample identity and three editorial templates.",
        min: 10000,
        max: 12000,
        deadline: "2026-11-02",
        trialScope: "One 15 minute sketch, no production work.",
        invitees: ["w2"],
      },
    });
    const b = s.briefs.at(-1)!;
    const g = s.gigs.at(-1)!;
    s = send(s, { type: "SWITCH", id: "w1" });
    expect(() =>
      applyAction(s, {
        type: "BID",
        briefId: b.id,
        price: 10000,
        days: 5,
        approach: "A thoughtful demo proposal with focused deliverables.",
      }),
    ).toThrow();
    s = send(
      s,
      { type: "SWITCH", id: "w2" },
      {
        type: "BID",
        briefId: b.id,
        price: 11000,
        days: 5,
        approach: "A thoughtful demo proposal with focused deliverables.",
      },
    );
    const bid = s.bids.at(-1)!;
    expect(() =>
      applyAction(s, {
        type: "BID",
        briefId: b.id,
        price: 11000,
        days: 5,
        approach: "Another thoughtful demo proposal with focused deliverables.",
      }),
    ).toThrow("already");
    s = send(
      s,
      { type: "SWITCH", id: "h1" },
      { type: "SELECT_BID", gigId: g.id, bidId: bid.id },
    );
    expect(gigService.get(s, g.id)?.status).toBe("Trial");
    expect(() =>
      applyAction(s, { type: "TRIAL_DECISION", gigId: g.id, accept: true }),
    ).toThrow("sample");
    s = send(
      s,
      { type: "SWITCH", id: "w2" },
      {
        type: "TRIAL_UPLOAD",
        gigId: g.id,
        note: "A small watermarked concept sketch.",
      },
      { type: "SWITCH", id: "h1" },
      { type: "TRIAL_DECISION", gigId: g.id, accept: true },
      { type: "FUND", gigId: g.id },
    );
    expect(gigService.get(s, g.id)?.ledger.fee).toBe(880);
    s = send(
      s,
      { type: "SWITCH", id: "w2" },
      {
        type: "DELIVER",
        gigId: g.id,
        note: "The fictional final artwork is ready.",
      },
      { type: "SWITCH", id: "h1" },
      { type: "RELEASE", gigId: g.id },
      {
        type: "RATE",
        gigId: g.id,
        scores: [5, 4, 5],
        note: "Thoughtful delivery and clear communication.",
      },
    );
    expect(gigService.ratingsVisible(s, gigService.get(s, g.id)!)).toBe(false);
    s = send(
      s,
      { type: "SWITCH", id: "w2" },
      {
        type: "RATE",
        gigId: g.id,
        scores: [5, 5, 5],
        note: "A clear brief and prompt communication.",
      },
    );
    const completed = gigService.get(s, g.id)!;
    expect(completed.status).toBe("Completed");
    expect(completed.ledger.workerPaid).toBe(10120);
    expect(gigService.ratingsVisible(s, completed)).toBe(true);
    const cert = s.certificates.find((c) => c.gigId === g.id)!;
    expect(certificateService.lookup(s, cert.code)).toEqual(cert);
    expect(s.workers[1].score).toBe(80);
  });
  it("rejects invalid budget, expired deadline, unreasonable bid timeline and wrong actor", () => {
    const s = createSeed();
    expect(() =>
      applyAction(s, {
        type: "BRIEF",
        brief: {
          title: "Invalid budget brief",
          deliverables: "Deliver a demo layout system.",
          min: 20,
          max: 10,
          deadline: "2026-10-20",
          trialScope: "One small concept sketch.",
          invitees: [],
        },
      }),
    ).toThrow("Budget");
    expect(() => applyAction(s, { type: "FUND", gigId: "g3" })).toThrow(
      "stage",
    );
    expect(() =>
      applyAction(s, {
        type: "DELIVER",
        gigId: "g2",
        note: "A complete demo delivery",
      }),
    ).toThrow("worker");
  });
  it("returns a rejected sample to bidding with its reason", () => {
    const s = actions({
      type: "TRIAL_DECISION",
      gigId: "g2",
      accept: false,
      reason: "Off-brief",
    });
    expect(s.gigs[1].status).toBe("Bidding");
    expect(s.gigs[1].trial.reason).toBe("Off-brief");
    expect(s.gigs[1].workerId).toBeUndefined();
  });
  it("requires context for extreme ratings, reveals on demo day 3 and prevents duplicate ratings", () => {
    let s = actions({ type: "RELEASE", gigId: "g3" });
    expect(() =>
      applyAction(s, {
        type: "RATE",
        gigId: "g3",
        scores: [5, 5, 5],
        note: "",
      }),
    ).toThrow("10–140");
    s = send(s, { type: "RATE", gigId: "g3", scores: [4, 4, 4], note: "" });
    expect(() =>
      applyAction(s, {
        type: "RATE",
        gigId: "g3",
        scores: [4, 4, 4],
        note: "",
      }),
    ).toThrow("already");
    s = send(s, { type: "ADVANCE", days: 3 });
    expect(gigService.ratingsVisible(s, s.gigs[2])).toBe(true);
  });
});
describe("disputes, ledgers and errors", () => {
  it.each([
    ["Released", 9200, 0, 800],
    ["Refunded", 0, 10000, 0],
    ["Split", 4600, 5000, 400],
  ] as const)(
    "settles %s and conserves gross funds",
    (outcome, workerPaid, hirerRefund, feeCollected) => {
      const s = actions({ type: "RESOLVE", gigId: "g4", outcome });
      const g = s.gigs[3];
      expect(g.ledger).toMatchObject({ workerPaid, hirerRefund, feeCollected });
      expect(workerPaid + hirerRefund + feeCollected).toBe(g.ledger.amount);
      expect(() =>
        applyAction(s, { type: "RESOLVE", gigId: "g4", outcome }),
      ).toThrow("stage");
    },
  );
  it("records both evidence notes and does not create a certificate for refunded work", () => {
    let s = actions(
      { type: "SWITCH", id: "w1" },
      {
        type: "EVIDENCE",
        gigId: "g4",
        note: "The agreed sample reference is included.",
      },
      { type: "RESOLVE", gigId: "g4", outcome: "Refunded" },
      { type: "RATE", gigId: "g4", scores: [3, 3, 3], note: "" },
      { type: "SWITCH", id: "h1" },
      { type: "RATE", gigId: "g4", scores: [3, 3, 3], note: "" },
    );
    expect(s.gigs[3].status).toBe("Completed");
    expect(s.certificates.some((c) => c.gigId === "g4")).toBe(false);
    s = send(s, { type: "FLAG", gigId: "g4", by: "worker" });
    expect(s.gigs[3].ratings.find((r) => r.by === "worker")?.flagged).toBe(
      true,
    );
  });
  it("reports errors without losing state or crashing the reducer", () => {
    const initial = createSeed();
    const s = demoReducer(initial, { type: "LIVE" });
    expect(s.workers).toEqual(initial.workers);
    expect(s.notice?.error).toBe(true);
  });
  it("looks up known certificates and handles unknown codes", () => {
    expect(
      certificateService.lookup(createSeed(), "AURA-2026-0001"),
    ).toBeDefined();
    expect(certificateService.lookup(createSeed(), "unknown")).toBeUndefined();
    expect(addDays("2026-10-30", 5)).toBe("2026-11-04");
  });
});
