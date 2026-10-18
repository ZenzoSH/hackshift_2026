import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  FileText,
  Send,
} from "lucide-react";
import { useDemo } from "../state/DemoContext";
import {
  addDays,
  briefService,
  dateLabel,
  money,
  workerService,
} from "../data/services";
import {
  Avatar,
  Banner,
  Button,
  ButtonLink,
  Empty,
  Field,
  PageTitle,
  Panel,
  StatusBadge,
} from "../components/ui";
export function PostBrief() {
  const { state, persona, dispatch } = useDemo();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [min, setMin] = useState("15000");
  const [max, setMax] = useState("25000");
  const [deadline, setDeadline] = useState(addDays(state.clock.date, 14));
  const [trialScope, setTrialScope] = useState("");
  const [invitees, setInvitees] = useState(state.shortlist[persona.id] || []);
  const [error, setError] = useState("");
  const shortlisted = state.shortlist[persona.id] || [];
  if (persona.role !== "hirer")
    return (
      <Empty title="A brief begins with a hirer">
        Switch to a hirer in Evaluator tools to post a brief.
      </Empty>
    );
  return (
    <>
      <PageTitle
        eyebrow="Make room for good work"
        title="Tell them what you have in mind."
        description="A clear brief is the first act of a great collaboration."
      />
      <div className="split-layout">
        <Panel>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              if (+min <= 0 || +max < +min)
                return setError(
                  "Budget maximum must be at least the positive minimum.",
                );
              if (deadline <= state.clock.date)
                return setError(
                  "Choose a deadline after the current demo date.",
                );
              const id = `g${state.serial + 1}`;
              dispatch({
                type: "BRIEF",
                brief: {
                  title,
                  deliverables,
                  min: +min,
                  max: +max,
                  deadline,
                  trialScope,
                  invitees,
                },
              });
              navigate(`/gigs/${id}`);
            }}
          >
            <Field
              label="Give your brief a title"
              hint="A few words about the outcome you’re hoping for."
            >
              <input
                required
                minLength={5}
                maxLength={100}
                placeholder="A thoughtful identity for a mindful brand"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>
            <Field
              label="What should be delivered?"
              hint="List the scope, formats and any useful constraints."
            >
              <textarea
                required
                minLength={15}
                placeholder="A logo system, a short brand guide and three social templates…"
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
              />
            </Field>
            <div className="form-two">
              <Field label="Minimum budget (₹)">
                <input
                  type="number"
                  min={1}
                  required
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                />
              </Field>
              <Field label="Maximum budget (₹)">
                <input
                  type="number"
                  min={+min || 1}
                  required
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </Field>
            </div>
            <Field
              label="Delivery deadline"
              hint={`Choose after ${dateLabel(state.clock.date)}, the simulated date.`}
            >
              <input
                type="date"
                min={addDays(state.clock.date, 1)}
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </Field>
            <Field
              label="One small trial task"
              hint="Describe one small task a worker can show you. Keep it short so nobody is asked to work for free."
            >
              <textarea
                required
                minLength={15}
                placeholder="One rough visual direction. 15 minutes maximum. No usable production assets."
                value={trialScope}
                onChange={(e) => setTrialScope(e.target.value)}
              />
            </Field>
            <Banner tone="warning">
              Trials are limited, watermarked and unpaid. Never request unpaid
              production work. Payments and invitations are simulated.
            </Banner>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button variant="primary" type="submit">
              {invitees.length
                ? `Post brief and invite ${invitees.length} workers`
                : "Post open demo brief"}
              <ArrowRight size={16} />
            </Button>
          </form>
        </Panel>
        <aside className="stack sticky-rail">
          <Panel>
            <h2>Your invitation list</h2>
            <p className="small muted">
              Choose who gets to see this brief in the demo. No real messages
              are sent.
            </p>
            {shortlisted.map((id) => {
              const w = workerService.get(state, id)!;
              return (
                <label className="invite-row" key={id}>
                  <input
                    type="checkbox"
                    checked={invitees.includes(id)}
                    onChange={(e) =>
                      setInvitees((prev) =>
                        e.target.checked
                          ? [...prev, id]
                          : prev.filter((v) => v !== id),
                      )
                    }
                  />
                  <Avatar id={id} name={w.name} size={38} />
                  <span>
                    <strong>{w.name}</strong>
                    <small>{w.category}</small>
                  </span>
                </label>
              );
            })}
            {!shortlisted.length && (
              <p>
                No workers shortlisted yet. With no invitees, this is an open
                brief for all demo workers.
              </p>
            )}
            <ButtonLink to="/shortlist">Manage shortlist</ButtonLink>
          </Panel>
          <div className="plain-tip">
            <FileText size={22} />
            <h3>Clear is kind.</h3>
            <p>
              Share the destination, leave room for the craft. A thoughtful
              brief helps both sides get off to a good start.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
export function Bids() {
  const { state, persona } = useDemo();
  const [tab, setTab] = useState("Available");
  const available = briefService.available(state);
  const own = state.bids.filter((b) => b.workerId === persona.id);
  return (
    <>
      <PageTitle
        eyebrow="The next chapter"
        title="Find work worth doing."
        description="Thoughtful briefs. Transparent budgets. A chance to show what you can do."
      />
      <div className="segmented inline-segmented">
        {["Available", "My proposals"].map((t) => (
          <Button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t} <span>{t === "Available" ? available.length : own.length}</span>
          </Button>
        ))}
      </div>
      {tab === "Available" ? (
        <div className="brief-grid">
          {available.map((b) => (
            <Panel key={b.id}>
              <div className="row between">
                <span className="badge positive">
                  <BadgeCheck size={14} />
                  Demo hirer
                </span>
                <span className="small muted">
                  {b.invitees.includes(persona.id)
                    ? "Invited to apply"
                    : "Open brief"}
                </span>
              </div>
              <Link to={`/bids/${b.id}`}>
                <h2>{b.title}</h2>
              </Link>
              <p className="brief-excerpt">{b.deliverables}</p>
              <div className="brief-budget">
                {money(b.min)} – {money(b.max)}
              </div>
              <p className="row small muted">
                <CalendarDays size={15} />
                Due {dateLabel(b.deadline)}
              </p>
              <ButtonLink to={`/bids/${b.id}`}>
                View brief <ArrowRight size={16} />
              </ButtonLink>
            </Panel>
          ))}
          {!available.length && (
            <Empty
              title="Nothing open for this persona yet."
              to="/dashboard"
              action="Go to dashboard"
            >
              Switch to a hirer and post an open brief, or invite this worker.
            </Empty>
          )}
        </div>
      ) : (
        <Panel className="flush">
          <div className="data-table">
            <div className="table-head">
              <span>Brief</span>
              <span>Proposal</span>
              <span>Status</span>
              <span>Next step</span>
            </div>
            {own.map((b) => (
              <div className="table-row" key={b.id}>
                <span>
                  <strong>{briefService.get(state, b.briefId)?.title}</strong>
                  <small>{dateLabel(b.createdAt)}</small>
                </span>
                <span>
                  {money(b.price)}
                  <small>{b.days} days</small>
                </span>
                <span>
                  <StatusBadge status={b.status} />
                </span>
                <Link to={`/bids/${b.briefId}`} className="text-link">
                  Open <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
          {!own.length && (
            <Empty title="Your first proposal starts a conversation.">
              Explore an available brief to share your approach.
            </Empty>
          )}
        </Panel>
      )}
    </>
  );
}
export function BidDetail() {
  const { id = "" } = useParams();
  const { state, dispatch, persona } = useDemo();
  const b = briefService.get(state, id);
  const [price, setPrice] = useState(b?.min.toString() || "");
  const [days, setDays] = useState("5");
  const [approach, setApproach] = useState("");
  const [error, setError] = useState("");
  if (!b)
    return (
      <Empty
        title="This brief isn’t in the demo."
        to="/bids"
        action="Browse briefs"
      >
        Explore an available sample brief.
      </Empty>
    );
  const hirer = state.hirers.find((h) => h.id === b.hirerId)!;
  const bid = state.bids.find(
    (bid) =>
      bid.briefId === b.id &&
      bid.workerId === persona.id &&
      bid.status !== "Rejected",
  );
  const gig = state.gigs.find((g) => g.briefId === b.id)!;
  const available = briefService
    .available(state)
    .some((item) => item.id === b.id);
  return (
    <>
      <PageTitle
        eyebrow={`A brief from ${hirer.company}`}
        title={b.title}
        description={`Due ${dateLabel(b.deadline)} · Demo opportunity`}
      />
      <div className="split-layout">
        <div className="stack">
          <Panel>
            <h2>The work</h2>
            <p>{b.deliverables}</p>
            <div className="brief-budget">
              {money(b.min)} – {money(b.max)}
            </div>
            <hr />
            <h3>A small first step</h3>
            <p>{b.trialScope}</p>
            <Banner tone="warning">
              Unpaid, watermarked trial only. Do not provide production work
              during a trial.
            </Banner>
          </Panel>
          <Panel>
            {bid ? (
              <>
                <div className="row">
                  <CheckCircle2 size={24} className="brand" />
                  <h2>Your proposal is in.</h2>
                </div>
                <p>{bid.approach}</p>
                <p>
                  <strong>{money(bid.price)}</strong> · {bid.days} days ·{" "}
                  <StatusBadge status={bid.status} />
                </p>
                <ButtonLink to={`/gigs/${gig.id}`}>
                  Open gig workspace <ArrowRight size={16} />
                </ButtonLink>
              </>
            ) : !available ? (
              <Empty title="This brief isn’t accepting your bid.">
                It may be in progress or invite-only for another worker.
              </Empty>
            ) : (
              <>
                <h2>Make your introduction.</h2>
                <form
                  className="form-stack"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (+price < b.min || +price > b.max)
                      return setError(
                        "Keep your proposal within the stated budget.",
                      );
                    if (addDays(state.clock.date, +days) > b.deadline)
                      return setError(
                        "Choose a timeline that ends by the delivery deadline.",
                      );
                    dispatch({
                      type: "BID",
                      briefId: b.id,
                      price: +price,
                      days: +days,
                      approach,
                    });
                  }}
                >
                  <div className="form-two">
                    <Field label="Your price (₹)">
                      <input
                        type="number"
                        required
                        min={b.min}
                        max={b.max}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </Field>
                    <Field label="Timeline (days)">
                      <input
                        type="number"
                        required
                        min={1}
                        max={365}
                        step={1}
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field
                    label="How would you approach this?"
                    hint="At least 20 characters. Use fictional project details only."
                  >
                    <textarea
                      required
                      minLength={20}
                      value={approach}
                      onChange={(e) => setApproach(e.target.value)}
                      placeholder="Here’s where I would start…"
                    />
                  </Field>
                  {error && (
                    <p className="error" role="alert">
                      {error}
                    </p>
                  )}
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={persona.role !== "worker"}
                  >
                    Send demo proposal <Send size={16} />
                  </Button>
                  {persona.role !== "worker" && (
                    <p className="small muted">
                      Switch to a worker to send a proposal.
                    </p>
                  )}
                </form>
              </>
            )}
          </Panel>
        </div>
        <aside className="stack sticky-rail">
          <Panel>
            <h2>Hirer facts</h2>
            <div className="row">
              <Avatar id={hirer.id} name={hirer.name} />
              <div>
                <strong>{hirer.name}</strong>
                <p className="small muted">{hirer.company}</p>
              </div>
            </div>
            <span
              className="badge positive"
              title="Seeded demo persona, no live identity check"
            >
              <BadgeCheck size={14} />
              Verified hirer · demo
            </span>
            <dl className="ledger">
              <div>
                <dt>Rating</dt>
                <dd>{hirer.rating}/5</dd>
              </div>
              <div>
                <dt>On-time payment</dt>
                <dd>{hirer.onTimePayment}%</dd>
              </div>
              <div>
                <dt>Accepted trials</dt>
                <dd>{hirer.acceptedTrials}</dd>
              </div>
              <div>
                <dt>Completed gigs</dt>
                <dd>{hirer.completedGigs}</dd>
              </div>
            </dl>
            <small className="muted">
              All trust metrics are seeded demo data.
            </small>
          </Panel>
          <Banner>
            Aura preview: {workerService.get(state, persona.id)?.score || 76} →{" "}
            {Math.min(
              100,
              (workerService.get(state, persona.id)?.score || 76) + 2,
            )}{" "}
            after a fully released, mutually rated gig. Illustrative +2 rule,
            not a validated scoring model.
          </Banner>
        </aside>
      </div>
    </>
  );
}
