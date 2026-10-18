import {
  categories,
  type DemoPersona,
  type DemoState,
  type CVClaim,
  type EscrowLedger,
  type Gig,
  type WorkerProfile,
} from "./types";
export const SEED_DATE = "2026-10-18";
const names = [
  "Aanya Sharma",
  "Kabir Mehta",
  "Meera Iyer",
  "Rohan Das",
  "Ishaan Rao",
  "Tara Kapoor",
  "Neel Patel",
];
const skills = [
  ["Brand identity", "Figma", "Design systems"],
  ["Next.js", "TypeScript", "Accessibility"],
  ["Premiere Pro", "Motion design", "Storytelling"],
  ["Python", "APIs", "Testing"],
  ["AutoCAD", "SketchUp", "Spatial design"],
  ["Content strategy", "Analytics", "Copywriting"],
  ["React", "Rapid prototyping", "UI design"],
];
const orderedCategories = [
  categories[6],
  categories[1],
  categories[2],
  categories[3],
  categories[4],
  categories[5],
  categories[0],
];
export const personas: DemoPersona[] = [
  { id: "h1", name: "Arjun Malhotra", role: "hirer", accountType: "Studio" },
  { id: "h2", name: "Leela Sen", role: "hirer", accountType: "Individual" },
  { id: "w8", name: "Maya Desai", role: "worker", accountType: "Studio" },
  ...names.map((name, i) => ({
    id: `w${i + 1}`,
    name,
    role: "worker" as const,
    accountType: "Individual" as const,
  })),
];
export function ledger(amount: number): EscrowLedger {
  return {
    amount,
    fee: Math.round(amount * 0.08),
    workerNet: amount - Math.round(amount * 0.08),
    funded: false,
    workerPaid: 0,
    hirerRefund: 0,
    feeCollected: 0,
    events: [],
  };
}
export function seedClaims(workerId: string): CVClaim[] {
  const definitions: {
    type: CVClaim["type"];
    text: string;
    status: CVClaim["status"];
    method: string;
  }[] = [
    {
      type: "Education",
      text: "Bachelor of Design · Class of 2023",
      status: "Verified",
      method: "Simulated education credential match",
    },
    {
      type: "Project",
      text: "Designed the Kanso brand and digital experience",
      status: "Partially verified",
      method: "Demo artifact present; contribution unconfirmed",
    },
    {
      type: "Skill",
      text: "Three years of independent creative practice",
      status: "Self-declared",
      method: "Worker statement; no adequate evidence yet",
    },
    {
      type: "Employment",
      text: "Lead designer at Northstar, 2021–2022",
      status: "Disproved",
      method: "Seeded contradiction: demo reference confirms a different role",
    },
    {
      type: "Project",
      text: "Delivered the Forma launch campaign",
      status: "Verified",
      method: "Simulated contribution history and client confirmation",
    },
  ];
  return definitions.map((c, i) => ({
    ...c,
    workerId,
    id: `${workerId}-c${i + 1}`,
    date: SEED_DATE,
    evidence: {
      id: `${workerId}-e${i + 1}`,
      artifact: i === 2 ? "Not supplied" : "Exists in the demo dataset",
      contribution:
        c.status === "Verified"
          ? "Seeded contribution confirmation"
          : i === 3
            ? "Explicitly contradicted by a seeded reference"
            : "Not confirmed",
      relationship:
        c.status === "Verified"
          ? "Seeded independent confirmation"
          : "Not confirmed",
    },
  }));
}
export function createSeed(): DemoState {
  const workers: WorkerProfile[] = names.map((name, i) => ({
    id: `w${i + 1}`,
    name,
    city: [
      "Bengaluru",
      "Delhi",
      "Mumbai",
      "Pune",
      "Ahmedabad",
      "Jaipur",
      "Hyderabad",
    ][i],
    category: orderedCategories[i],
    skills: skills[i],
    bio: [
      "I turn thoughtful ideas into identities and digital experiences that feel effortless. I care about the details, the people using them, and making the process collaborative.",
      "I build thoughtful, accessible experiences for the web. Clear communication and reliable delivery are part of every project.",
    ][i % 2],
    rate: [1800, 2200, 1500, 2400, 2000, 1200, 1600][i],
    rating: [4.9, 4.8, 4.9, 4.7, 4.8, 4.6, 4.8][i],
    ratingCount: 12 + i * 3,
    completedGigs: 18 + i * 2,
    onTime: 96 + (i % 4),
    earned: 186000 + i * 14000,
    streak: 7 - (i % 3),
    score: 76 + i * 2,
    level: "Silver",
    declaration: i !== 0,
    live: i !== 0,
    interests: [orderedCategories[i]],
    portfolio: [
      {
        id: `w${i + 1}-p1`,
        title: [
          "Kanso · A quieter kind of brand",
          "Bloom · A better web experience",
          "Between frames · Brand film",
          "Orbit · Developer toolkit",
          "Courtyard · Living spaces",
          "Small stories · Big impact",
          "Studio zero · From prompt to product",
        ][i],
        category: orderedCategories[i],
        caption:
          "Seeded artifact. A portfolio preview alone does not establish authorship.",
      },
      {
        id: `w${i + 1}-p2`,
        title: "Forma · Built with intention",
        category: orderedCategories[i],
        caption:
          "Illustrative portfolio work with simulated contribution records.",
      },
    ],
  }));
  workers.push({
    ...workers[0],
    id: "w8",
    name: "Maya Desai",
    city: "Chennai",
    declaration: true,
    live: true,
    skills: ["Brand identity", "Illustration", "Typography"],
    portfolio: workers[0].portfolio.map((p, i) => ({
      ...p,
      id: `w8-p${i + 1}`,
    })),
  });
  const briefs = [
    {
      id: "b1",
      hirerId: "h1",
      title: "A thoughtful identity for a mindful brand",
      deliverables:
        "Logo system, a 6-page brand guide, colour palette and three social templates.",
      min: 18000,
      max: 25000,
      deadline: "2026-11-02",
      trialScope:
        "One rough visual direction using supplied shapes. Maximum 20 minutes; no production assets.",
      invitees: ["w1", "w7"],
      createdAt: SEED_DATE,
    },
    {
      id: "b2",
      hirerId: "h1",
      title: "Kanso landing page refresh",
      deliverables:
        "Responsive homepage concept and desktop/mobile Figma frames.",
      min: 12000,
      max: 18000,
      deadline: "2026-10-26",
      trialScope: "A single low-fidelity hero wireframe, 15 minutes maximum.",
      invitees: ["w1"],
      createdAt: SEED_DATE,
    },
    {
      id: "b3",
      hirerId: "h1",
      title: "Forma launch campaign",
      deliverables: "Three launch posters and an editable social template.",
      min: 20000,
      max: 24000,
      deadline: "2026-10-23",
      trialScope: "One rough composition, 15 minutes maximum.",
      invitees: ["w1"],
      createdAt: SEED_DATE,
    },
    {
      id: "b4",
      hirerId: "h1",
      title: "Northstar social kit",
      deliverables: "Four social cards in the agreed sizes.",
      min: 8000,
      max: 10000,
      deadline: "2026-10-20",
      trialScope: "One sketch, 10 minutes maximum.",
      invitees: ["w1"],
      createdAt: SEED_DATE,
    },
    {
      id: "b5",
      hirerId: "h1",
      title: "The Everyday editorial identity",
      deliverables: "Identity guidelines and editorial layout system.",
      min: 30000,
      max: 32000,
      deadline: "2026-10-17",
      trialScope: "One type pairing, 10 minutes maximum.",
      invitees: ["w1"],
      createdAt: SEED_DATE,
    },
    {
      id: "b6",
      hirerId: "h2",
      title: "An accessible home for a local studio",
      deliverables:
        "A responsive homepage and an accessible contact form concept.",
      min: 15000,
      max: 20000,
      deadline: "2026-11-04",
      trialScope: "One navigation sketch, 15 minutes maximum.",
      invitees: [],
      createdAt: SEED_DATE,
    },
  ];
  const stages: Gig["status"][] = [
    "Bidding",
    "Trial",
    "Delivered",
    "Disputed",
    "Completed",
    "Bidding",
  ];
  const gigs: Gig[] = briefs.map((b, i) => ({
    id: `g${i + 1}`,
    briefId: b.id,
    hirerId: b.hirerId,
    workerId: i === 0 || i === 5 ? undefined : "w1",
    status: stages[i],
    trial: {
      submitted: i > 0 && i < 5,
      note: "A restrained composition, using the agreed type and spacing.",
      ...(i > 1 && i < 5 ? { decision: "Accepted" as const } : {}),
    },
    ledger: {
      ...ledger(b.max),
      funded: i >= 2 && i <= 4,
      ...(i === 4 ? { workerPaid: 29440, feeCollected: 2560 } : {}),
      events:
        i >= 2 && i <= 4
          ? [
              { date: SEED_DATE, text: "Demo escrow funded" },
              ...(i === 4
                ? [{ date: SEED_DATE, text: "Simulated funds released" }]
                : []),
            ]
          : [],
    },
    deliveryNote:
      i >= 2 && i <= 4
        ? "Editable source files and final previews are included in this simulated delivery."
        : "",
    ...(i === 3
      ? {
          dispute: {
            hirerNote:
              "Two cards use a different aspect ratio than the agreed brief.",
            workerNote:
              "The sample ratio was approved. I can supply the additional sizes.",
          },
        }
      : {}),
    ...(i === 2 ? { deliveredAt: SEED_DATE } : {}),
    ...(i === 4 ? { outcomeAt: SEED_DATE, outcome: "Released" as const } : {}),
    ratings:
      i === 4
        ? [
            {
              by: "hirer",
              scores: [5, 5, 4],
              note: "Thoughtful craft and clear communication throughout.",
              date: SEED_DATE,
              flagged: false,
            },
            {
              by: "worker",
              scores: [5, 5, 5],
              note: "A focused brief with timely and constructive feedback.",
              date: SEED_DATE,
              flagged: false,
            },
          ]
        : [],
  }));
  return {
    version: 1,
    personaId: "h1",
    clock: { date: SEED_DATE },
    workers,
    hirers: [
      {
        id: "h1",
        name: "Arjun Malhotra",
        company: "Kanso Studio",
        rating: 4.9,
        onTimePayment: 98,
        acceptedTrials: 14,
        completedGigs: 21,
      },
      {
        id: "h2",
        name: "Leela Sen",
        company: "Independent",
        rating: 4.8,
        onTimePayment: 100,
        acceptedTrials: 5,
        completedGigs: 8,
      },
    ],
    claims: workers.flatMap((w) => seedClaims(w.id)),
    briefs,
    bids: [
      {
        id: "bid1",
        briefId: "b1",
        workerId: "w1",
        price: 22000,
        days: 10,
        approach:
          "Start with a focused discovery session, then explore two visual directions and refine the strongest system.",
        status: "Pending",
        createdAt: SEED_DATE,
      },
    ],
    gigs,
    certificates: [
      {
        code: "AURA-2026-0001",
        gigId: "g5",
        workerId: "w1",
        hirerId: "h1",
        title: briefs[4].title,
        issuedAt: SEED_DATE,
        outcome: "Simulated escrow released in full",
      },
    ],
    activity: [
      {
        id: "a1",
        personaId: "w1",
        text: "Completed The Everyday editorial identity",
        date: SEED_DATE,
      },
      {
        id: "a2",
        personaId: "w1",
        text: "Sent a proposal to Kanso Studio",
        date: SEED_DATE,
      },
      {
        id: "a3",
        personaId: "h1",
        text: "Aanya delivered the Forma launch campaign",
        date: SEED_DATE,
      },
    ],
    shortlist: { h1: ["w1", "w2"], h2: [] },
    priority: { h1: ["w1"], h2: [] },
    notifications: {},
    onboarding: {},
    accountTypes: {},
    notice: null,
    serial: 100,
  };
}
