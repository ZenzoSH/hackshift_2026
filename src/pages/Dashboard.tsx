import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Clock3,
  Flame,
  Heart,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import { useDemo } from "../state/DemoContext";
import {
  addDays,
  briefService,
  claimService,
  dateLabel,
  gigService,
  money,
  workerService,
} from "../data/services";
import type { DemoState, Gig } from "../data/types";
import {
  Avatar,
  Button,
  ButtonLink,
  ClaimRing,
  Empty,
  PageTitle,
  Panel,
  StatusBadge,
} from "../components/ui";
export const nextAction = (g: Gig) =>
  ({
    Bidding: "Review bids",
    Trial: g.trial.submitted ? "Review sample" : "Prepare sample",
    "Awaiting escrow": "Fund demo escrow",
    "In progress": "View delivery",
    Delivered: "Review delivery",
    Disputed: "View dispute",
    Released: "Leave a rating",
    Refunded: "Leave a rating",
    Split: "Leave a rating",
    Completed: "View outcome",
  })[g.status];
export function GigsTable({ gigs, state }: { gigs: Gig[]; state: DemoState }) {
  return (
    <div className="data-table">
      <div className="table-head">
        <span>Project / collaborator</span>
        <span>Budget / deadline</span>
        <span>Stage</span>
        <span>Next step</span>
      </div>
      {gigs.map((g) => {
        const b = briefService.get(state, g.briefId)!;
        const w = workerService.get(state, g.workerId || "");
        return (
          <div className="table-row" key={g.id}>
            <span>
              <Link to={`/gigs/${g.id}`}>
                <strong>{b.title}</strong>
              </Link>
              <small>{w?.name || "Finding the right person"}</small>
            </span>
            <span>
              {money(g.ledger.amount)}
              <small
                className={
                  b.deadline < state.clock.date &&
                  !["Completed", "Released", "Refunded", "Split"].includes(
                    g.status,
                  )
                    ? "error"
                    : ""
                }
              >
                {dateLabel(b.deadline)}
                {b.deadline < state.clock.date &&
                !["Completed", "Released", "Refunded", "Split"].includes(
                  g.status,
                )
                  ? " · overdue"
                  : ""}
              </small>
            </span>
            <span>
              <StatusBadge status={g.status} />
            </span>
            <Link className="text-link" to={`/gigs/${g.id}`}>
              {nextAction(g)}
              <ArrowRight size={14} />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
export function Dashboard() {
  const { persona } = useDemo();
  return persona.role === "worker" ? <WorkerDashboard /> : <HirerDashboard />;
}
function HirerDashboard() {
  const { state, persona } = useDemo();
  const [filter, setFilter] = useState("Active");
  const hirer = state.hirers.find((h) => h.id === persona.id)!;
  const gigs = gigService.forPersona(state);
  const groups: Record<string, Gig[]> = {
    Active: gigs.filter(
      (g) => !["Completed", "Refunded", "Released", "Split"].includes(g.status),
    ),
    Accepted: gigs.filter(
      (g) => g.trial.decision === "Accepted" && g.status !== "Completed",
    ),
    Rejected: gigs.filter(
      (g) =>
        g.trial.decision === "Rejected" ||
        g.status === "Refunded" ||
        g.outcome === "Refunded",
    ),
    Completed: gigs.filter((g) => g.status === "Completed"),
  };
  const favourites = state.shortlist[persona.id] || [];
  return (
    <>
      <PageTitle
        eyebrow={`${hirer.company} · Your workspace`}
        title={`A good day to build, ${hirer.name.split(" ")[0]}.`}
        description="A little clarity on everything you’re making happen."
        action={
          <ButtonLink to="/search" primary>
            <Search size={16} />
            New search
          </ButtonLink>
        }
      />
      <div className="stat-strip">
        {Object.entries(groups).map(([name, items]) => (
          <button
            key={name}
            className={filter === name ? "active" : ""}
            onClick={() => setFilter(name)}
            aria-pressed={filter === name}
          >
            <span>{name}</span>
            <strong>{String(items.length).padStart(2, "0")}</strong>
            <small>
              {name === "Active"
                ? "Moving things forward"
                : name === "Accepted"
                  ? "Trials that found a fit"
                  : name === "Rejected"
                    ? "Room for a new direction"
                    : "Good work, delivered"}
            </small>
          </button>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="stack">
          <Panel className="flush">
            <div className="panel-heading">
              <h2>{filter} gigs</h2>
              <Link to="/gigs" className="text-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {groups[filter].length ? (
              <GigsTable gigs={groups[filter]} state={state} />
            ) : (
              <Empty
                title={`No ${filter.toLowerCase()} gigs here.`}
                to="/search"
                action="Find a collaborator"
              >
                Your next collaboration is a good place to start.
              </Empty>
            )}
          </Panel>
          <Panel>
            <h2>Recently in your workspace</h2>
            <ul className="activity-feed">
              {state.activity
                .filter((a) => a.personaId === persona.id)
                .slice(0, 4)
                .map((a) => (
                  <li key={a.id}>
                    <span>
                      <Clock3 size={16} />
                    </span>
                    <div>
                      {a.text}
                      <small>{dateLabel(a.date)}</small>
                    </div>
                  </li>
                ))}
            </ul>
          </Panel>
        </div>
        <aside className="stack">
          <Panel>
            <div className="row between">
              <h2>Favourite people</h2>
              <Heart size={18} />
            </div>
            {favourites.map((id) => {
              const w = workerService.get(state, id)!;
              return (
                <Link className="shortlist-mini" key={id} to={`/workers/${id}`}>
                  <Avatar id={id} name={w.name} size={40} />
                  <div>
                    <strong>{w.name}</strong>
                    <span>{w.category}</span>
                  </div>
                  <ArrowRight size={14} />
                </Link>
              );
            })}
            {!favourites.length && (
              <p className="muted">Your shortlist will appear here.</p>
            )}
            <Link to="/shortlist" className="text-link">
              Manage shortlist <ArrowRight size={14} />
            </Link>
          </Panel>
          <div className="discovery-tip">
            <span className="small">Made for the first yes</span>
            <h2>
              Start small.
              <br />
              Build trust.
            </h2>
            <p>
              A focused sample helps you and your collaborator find your rhythm.
            </p>
            <ButtonLink to="/briefs/new">
              Post a brief <ArrowRight size={14} />
            </ButtonLink>
          </div>
        </aside>
      </div>
    </>
  );
}
function WorkerDashboard() {
  const { state, persona } = useDemo();
  const w = workerService.get(state, persona.id)!;
  const claims = claimService.forWorker(state, w.id);
  const bids = state.bids.filter((b) => b.workerId === w.id);
  const gigs = gigService.forPersona(state);
  return (
    <>
      <PageTitle
        eyebrow="Your work. Your story."
        title={`Keep good things going, ${w.name.split(" ")[0]}.`}
        description="Every honest claim and thoughtful delivery adds to the picture."
        action={
          <ButtonLink to="/bids" primary>
            Find your next brief <ArrowRight size={16} />
          </ButtonLink>
        }
      />
      <div className="worker-dashboard-top">
        <Panel className="score-panel">
          <ClaimRing claims={claims} score={w.score} size="lg" />
          <div>
            <span className="badge positive">
              <TrendingUp size={14} />
              {w.level} level
            </span>
            <h2>
              Built one good
              <br />
              collaboration at a time.
            </h2>
            <p className="small muted">
              Illustrative score · seeded baseline +2 per released, mutually
              rated gig.
            </p>
            <Link to="/cv" className="text-link">
              Strengthen your CV <ArrowRight size={14} />
            </Link>
          </div>
        </Panel>
        <Panel className="streak-panel">
          <div className="row between">
            <h2>A little consistency goes a long way.</h2>
            <Flame size={22} />
          </div>
          <p>
            <strong>{w.streak} of 11</strong> steps on your current streak.
          </p>
          <div className="streak-steps">
            {Array.from({ length: 11 }, (_, i) => (
              <span
                key={i}
                role="img"
                className={i < w.streak ? "done" : ""}
                aria-label={`Step ${i + 1}: ${i < w.streak ? "complete" : "remaining"}`}
              >
                {i < w.streak ? <Check size={14} /> : i + 1}
              </span>
            ))}
          </div>
          <p className="small muted">
            A seeded activity preview. Completed gigs move the streak forward.
          </p>
        </Panel>
      </div>
      <div className="stat-strip worker-stats">
        {[
          { label: "Current streak", value: `${w.streak}/11` },
          {
            label: "Claims verified · demo",
            value: `${claims.filter((c) => c.status === "Verified").length}/${claims.length}`,
          },
          { label: "Average rating", value: `${w.rating}/5` },
          { label: "Earned on Aura · demo", value: money(w.earned) },
        ].map((s) => (
          <div key={s.label}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="stack">
          <Panel className="flush">
            <div className="panel-heading">
              <h2>Your engagements</h2>
              <Link className="text-link" to="/gigs">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {gigs.length ? (
              <GigsTable gigs={gigs.slice(0, 4)} state={state} />
            ) : (
              <Empty
                title="Your next chapter is unwritten."
                to="/bids"
                action="Browse briefs"
              >
                Find a brief and send your first demo proposal.
              </Empty>
            )}
          </Panel>
          <Panel>
            <h2>Recent proposals</h2>
            {bids.map((b) => (
              <Link
                className="proposal-row"
                to={`/bids/${b.briefId}`}
                key={b.id}
              >
                <span>
                  <strong>{briefService.get(state, b.briefId)?.title}</strong>
                  <small>
                    {money(b.price)} · Due{" "}
                    {dateLabel(briefService.get(state, b.briefId)!.deadline)}
                  </small>
                </span>
                <StatusBadge status={b.status} />
                <ArrowRight size={16} />
              </Link>
            ))}
            {!bids.length && (
              <p className="muted">
                No proposals yet. Browse briefs to get started.
              </p>
            )}
          </Panel>
        </div>
        <aside className="stack">
          <Panel>
            <div className="row between">
              <h2>Showing up</h2>
              <Star size={18} />
            </div>
            <p className="small muted">12 weeks of illustrative activity</p>
            <div
              className="heatmap"
              role="img"
              aria-label="84-day deterministic activity heatmap"
            >
              {Array.from({ length: 84 }, (_, i) => {
                const level = (i * 7 + (i % 5) + Number(w.id.slice(1))) % 5;
                return (
                  <span
                    key={i}
                    className={`heat-${level}`}
                    title={`${dateLabel(addDays(state.clock.date, i - 83))}: ${level} demo activities`}
                  />
                );
              })}
            </div>
            <div className="heatmap-legend">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((i) => (
                <i key={i} className={`heat-${i}`} />
              ))}
              <span>More</span>
            </div>
          </Panel>
          <Panel>
            <h2>Your recent activity</h2>
            <ul className="activity-feed">
              {state.activity
                .filter((a) => a.personaId === persona.id)
                .slice(0, 4)
                .map((a) => (
                  <li key={a.id}>
                    <span>
                      <Check size={15} />
                    </span>
                    <div>
                      {a.text}
                      <small>{dateLabel(a.date)}</small>
                    </div>
                  </li>
                ))}
            </ul>
            <Link to="/cv" className="text-link">
              Review your claims <ArrowRight size={14} />
            </Link>
          </Panel>
        </aside>
      </div>
    </>
  );
}
export function Gigs() {
  const { state } = useDemo();
  const [filter, setFilter] = useState("All");
  const gigs = gigService.forPersona(state);
  const filtered = gigs.filter(
    (g) =>
      filter === "All" ||
      (filter === "Completed"
        ? g.status === "Completed"
        : filter === "Needs review"
          ? ["Delivered", "Disputed", "Released", "Refunded", "Split"].includes(
              g.status,
            )
          : !["Completed", "Released", "Refunded", "Split"].includes(g.status)),
  );
  return (
    <>
      <PageTitle
        title="My gigs"
        description="From the first proposal to the final thank you."
      />
      <div className="segmented inline-segmented">
        {["All", "Active", "Needs review", "Completed"].map((f) => (
          <Button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>
      <Panel className="flush">
        {filtered.length ? (
          <GigsTable gigs={filtered} state={state} />
        ) : (
          <Empty
            title="A little room for what’s next."
            to="/dashboard"
            action="Back to dashboard"
          >
            No gigs match this filter.
          </Empty>
        )}
      </Panel>
    </>
  );
}
