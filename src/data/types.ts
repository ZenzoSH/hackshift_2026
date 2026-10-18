export const categories = [
  "Vibecoding",
  "Web Development",
  "Video Editing",
  "Software",
  "Architecture Design",
  "Social Media Marketing",
  "Design & Graphics",
] as const;
export type Category = (typeof categories)[number];
export type Role = "hirer" | "worker";
export type ProofStatus =
  "Verified" | "Partially verified" | "Self-declared" | "Disproved";
export interface DemoPersona {
  id: string;
  name: string;
  role: Role;
  accountType: "Individual" | "Studio";
}
export interface EvidenceItem {
  id: string;
  url?: string;
  artifact: string;
  contribution: string;
  relationship: string;
}
export interface CVClaim {
  id: string;
  workerId: string;
  type: "Education" | "Employment" | "Skill" | "Project";
  text: string;
  status: ProofStatus;
  method: string;
  date: string;
  evidence: EvidenceItem;
}
export interface PortfolioItem {
  id: string;
  title: string;
  category: Category;
  caption: string;
}
export interface WorkerProfile {
  id: string;
  name: string;
  city: string;
  category: Category;
  skills: string[];
  bio: string;
  rate: number;
  rating: number;
  ratingCount: number;
  completedGigs: number;
  onTime: number;
  earned: number;
  streak: number;
  score: number;
  level: string;
  portfolio: PortfolioItem[];
  declaration: boolean;
  live: boolean;
  interests: Category[];
}
export interface HirerProfile {
  id: string;
  name: string;
  company: string;
  rating: number;
  onTimePayment: number;
  acceptedTrials: number;
  completedGigs: number;
}
export interface Brief {
  id: string;
  hirerId: string;
  title: string;
  deliverables: string;
  min: number;
  max: number;
  deadline: string;
  trialScope: string;
  invitees: string[];
  createdAt: string;
}
export interface Bid {
  id: string;
  briefId: string;
  workerId: string;
  price: number;
  days: number;
  approach: string;
  status: "Pending" | "Selected" | "Rejected";
  createdAt: string;
}
export type GigStatus =
  | "Bidding"
  | "Trial"
  | "Awaiting escrow"
  | "In progress"
  | "Delivered"
  | "Disputed"
  | "Released"
  | "Refunded"
  | "Split"
  | "Completed";
export interface Trial {
  submitted: boolean;
  note: string;
  decision?: "Accepted" | "Rejected";
  reason?: string;
}
export interface EscrowLedger {
  amount: number;
  fee: number;
  workerNet: number;
  funded: boolean;
  workerPaid: number;
  hirerRefund: number;
  feeCollected: number;
  events: { date: string; text: string }[];
}
export interface Rating {
  by: Role;
  scores: number[];
  note: string;
  date: string;
  flagged: boolean;
}
export interface Gig {
  id: string;
  briefId: string;
  hirerId: string;
  workerId?: string;
  status: GigStatus;
  trial: Trial;
  ledger: EscrowLedger;
  deliveryNote: string;
  dispute?: { hirerNote: string; workerNote: string; decision?: string };
  ratings: Rating[];
  outcomeAt?: string;
  deliveredAt?: string;
  outcome?: "Released" | "Refunded" | "Split";
}
export interface Certificate {
  code: string;
  gigId: string;
  workerId: string;
  hirerId: string;
  title: string;
  issuedAt: string;
  outcome: string;
}
export interface ActivityEvent {
  id: string;
  personaId: string;
  text: string;
  date: string;
}
export interface DemoClock {
  date: string;
}
export interface DemoState {
  version: 1;
  personaId: string;
  clock: DemoClock;
  workers: WorkerProfile[];
  hirers: HirerProfile[];
  claims: CVClaim[];
  briefs: Brief[];
  bids: Bid[];
  gigs: Gig[];
  certificates: Certificate[];
  activity: ActivityEvent[];
  shortlist: Record<string, string[]>;
  priority: Record<string, string[]>;
  notifications: Record<string, boolean>;
  onboarding: Record<string, boolean>;
  accountTypes: Record<string, "Individual" | "Studio">;
  notice: { text: string; error: boolean; serial: number } | null;
  serial: number;
}
export type Action =
  | { type: "SWITCH"; id: string }
  | { type: "ADVANCE"; days: 1 | 3 | 5 }
  | { type: "RESET" }
  | { type: "NOTICE"; text: string; error?: boolean }
  | { type: "SHORTLIST"; workerId: string; mode: "add" | "remove" | "priority" }
  | { type: "RESTORE_SHORTLIST"; ids: string[]; priorities: string[] }
  | { type: "INTERESTS"; interests: Category[] }
  | { type: "ONBOARD"; accountType?: "Individual" | "Studio" }
  | { type: "NOTIFICATIONS"; enabled: boolean }
  | { type: "PROFILE"; name: string; city?: string }
  | { type: "EDIT_CLAIM"; id: string; text: string }
  | { type: "DELETE_CLAIM"; id: string }
  | { type: "PROOF"; id: string; url: string }
  | { type: "VERIFY_CLAIM"; id: string; method: string }
  | { type: "PARSE" }
  | { type: "DECLARE"; signed: boolean }
  | { type: "LIVE" }
  | { type: "BRIEF"; brief: Omit<Brief, "id" | "hirerId" | "createdAt"> }
  | {
      type: "BID";
      briefId: string;
      price: number;
      days: number;
      approach: string;
    }
  | { type: "SELECT_BID"; gigId: string; bidId: string }
  | { type: "TRIAL_UPLOAD"; gigId: string; note: string }
  | { type: "TRIAL_DECISION"; gigId: string; accept: boolean; reason?: string }
  | { type: "FUND"; gigId: string }
  | { type: "DELIVER"; gigId: string; note: string }
  | { type: "RELEASE"; gigId: string }
  | { type: "DISPUTE"; gigId: string; note: string }
  | { type: "EVIDENCE"; gigId: string; note: string }
  | {
      type: "RESOLVE";
      gigId: string;
      outcome: "Released" | "Refunded" | "Split";
    }
  | { type: "RATE"; gigId: string; scores: number[]; note: string }
  | { type: "FLAG"; gigId: string; by: Role };
