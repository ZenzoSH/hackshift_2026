import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleCheck,
  FileCheck2,
  Flag,
  LockKeyhole,
  MessageSquare,
  Star,
  Upload,
} from "lucide-react";
import { useDemo } from "../state/DemoContext";
import {
  addDays,
  briefService,
  dateLabel,
  gigService,
  money,
  workerService,
} from "../data/services";
import type { Action, Gig } from "../data/types";
import {
  Avatar,
  Banner,
  Button,
  ButtonLink,
  Confirm,
  Empty,
  EscrowPanel,
  Field,
  Modal,
  PageTitle,
  Panel,
  PortfolioArt,
  StatusBadge,
  TrialPreview,
} from "../components/ui";
export function GigWorkspace() {
  const { id = "" } = useParams();
  const { state, persona, dispatch } = useDemo();
  const gig = gigService.get(state, id);
  const [confirm, setConfirm] = useState<{
    title: string;
    description: string;
    action: Action;
    label: string;
  }>();
  const [dialog, setDialog] = useState<"reject" | "dispute">();
  const [reason, setReason] = useState("Off-brief");
  const [note, setNote] = useState("");
  if (!gig)
    return (
      <Empty
        title="This gig isn’t in the demo."
        to="/gigs"
        action="See my gigs"
      >
        It may have been removed by a demo reset.
      </Empty>
    );
  const brief = briefService.get(state, gig.briefId)!;
  const worker = workerService.get(state, gig.workerId || "");
  const hirer = state.hirers.find((h) => h.id === gig.hirerId)!;
  const isHirer = persona.id === gig.hirerId;
  const isWorker = persona.id === gig.workerId;
  const stage = gigService.stage(gig);
  const certificate = state.certificates.find((c) => c.gigId === gig.id);
  const bids = state.bids.filter(
    (b) => b.briefId === brief.id && b.status === "Pending",
  );
  const stageNames = [
    "Bidding",
    "Trial",
    "Escrow",
    "Delivery",
    "Review",
    "Rating",
  ];
  function ask(
    action: Action,
    title: string,
    description: string,
    label: string,
  ) {
    setConfirm({ action, title, description, label });
  }
  return (
    <>
      <PageTitle
        eyebrow={`${hirer.company} · Gig workspace`}
        title={brief.title}
        description={`Due ${dateLabel(brief.deadline)} · ${worker ? `With ${worker.name}` : "Finding your collaborator"}`}
        action={<StatusBadge status={gig.status} />}
      />
      <ol className="gig-stepper" aria-label="Gig progress">
        {stageNames.map((name, i) => (
          <li
            key={name}
            className={i < stage ? "complete" : i === stage ? "current" : ""}
            aria-current={i === stage ? "step" : undefined}
          >
            <span>{i < stage ? <Check size={15} /> : i + 1}</span>
            <strong>{name}</strong>
          </li>
        ))}
      </ol>
      {!isHirer && !isWorker && (
        <Banner>
          Viewing a demo engagement. Use Evaluator tools to switch to{" "}
          {hirer.name}
          {worker ? ` or ${worker.name}` : ""} for stage actions.
        </Banner>
      )}
      <div className="split-layout">
        <div className="stack">
          {gig.status === "Bidding" && (
            <>
              <Panel>
                <h2>The brief</h2>
                <p>{brief.deliverables}</p>
                <div className="row between">
                  <strong>
                    {money(brief.min)} – {money(brief.max)}
                  </strong>
                  <span className="small muted">
                    Due {dateLabel(brief.deadline)}
                  </span>
                </div>
                <hr />
                <h3>The small trial</h3>
                <p>{brief.trialScope}</p>
                <Banner tone="warning">
                  Watermarked, unpaid preview only. No unpaid production work.
                </Banner>
                <p className="small muted">
                  {brief.invitees.length
                    ? `Demo invitees: ${brief.invitees.map((id) => workerService.get(state, id)?.name).join(", ")}`
                    : "Open to all demo workers. Invitations and messages are simulated."}
                </p>
              </Panel>
              {gig.trial.decision === "Rejected" && (
                <Banner tone="warning">
                  Previous trial rejected: {gig.trial.reason}. This brief is
                  accepting new proposals.
                </Banner>
              )}
              <Panel>
                <div className="row between">
                  <h2>Proposals</h2>
                  <span className="badge neutral-badge">{bids.length}</span>
                </div>
                {bids.map((b) => {
                  const w = workerService.get(state, b.workerId)!;
                  return (
                    <article className="bid-review" key={b.id}>
                      <div className="row">
                        <Avatar id={w.id} name={w.name} />
                        <div className="grow">
                          <Link to={`/workers/${w.id}`}>
                            <strong>{w.name}</strong>
                          </Link>
                          <p className="small muted">
                            {money(b.price)} · {b.days} days
                          </p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                      <p>{b.approach}</p>
                      {isHirer && (
                        <Button
                          onClick={() =>
                            ask(
                              {
                                type: "SELECT_BID",
                                gigId: gig.id,
                                bidId: b.id,
                              },
                              "Request a small trial?",
                              `Invite ${w.name} to the scoped, unpaid preview. The agreed demo price will be ${money(b.price)}.`,
                              "Request trial",
                            )
                          }
                        >
                          Request trial <ArrowRight size={16} />
                        </Button>
                      )}
                    </article>
                  );
                })}
                {!bids.length && (
                  <Empty title="A good conversation is on its way.">
                    Switch to an invited worker, open Bids, and send a proposal.
                  </Empty>
                )}
                {persona.role === "worker" && (
                  <ButtonLink to={`/bids/${brief.id}`}>
                    View brief and bid <ArrowRight size={16} />
                  </ButtonLink>
                )}
              </Panel>
            </>
          )}
          {gig.status === "Trial" && (
            <Panel>
              <div className="row between">
                <h2>A small sample. A clearer decision.</h2>
                <span className="badge warning">Unpaid preview</span>
              </div>
              <p>{brief.trialScope}</p>
              {gig.trial.submitted ? (
                <>
                  <TrialPreview category={worker?.category} />
                  <p>{gig.trial.note}</p>
                  <Banner>
                    Simulated sample only. Review against the scoped task; do
                    not use this preview as production work.
                  </Banner>
                  {isHirer && (
                    <div className="actions">
                      <Button
                        variant="primary"
                        onClick={() =>
                          ask(
                            {
                              type: "TRIAL_DECISION",
                              gigId: gig.id,
                              accept: true,
                            },
                            "Accept this trial?",
                            "The next step is the simulated escrow ledger. No payment happens at this step.",
                            "Accept trial",
                          )
                        }
                      >
                        <Check size={16} />
                        Accept trial
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setDialog("reject")}
                      >
                        Reject with a reason
                      </Button>
                    </div>
                  )}
                  {isWorker && (
                    <p className="small muted">
                      Your sample is ready for the hirer. Switch personas to
                      review it.
                    </p>
                  )}
                </>
              ) : isWorker ? (
                <DemoDelivery gig={gig} trial />
              ) : (
                <Empty title="Room for the first idea.">
                  The selected worker can attach a sample. Use Evaluator tools
                  to switch to {worker?.name}.
                </Empty>
              )}
            </Panel>
          )}
          {gig.status === "Awaiting escrow" && (
            <Panel>
              <div className="stage-icon">
                <LockKeyhole size={28} />
              </div>
              <h2>A little certainty for both sides.</h2>
              <p>
                The trial is accepted. Review the agreed amount, 8% fee and
                worker net before funding demo escrow.
              </p>
              <Banner tone="warning">
                Simulated payment. No bank, card, UPI or payment gateway is
                connected.
              </Banner>
              {isHirer ? (
                <Button
                  variant="primary"
                  onClick={() =>
                    ask(
                      { type: "FUND", gigId: gig.id },
                      "Fund simulated escrow?",
                      `${money(gig.ledger.amount)} will be marked as held in this demo. Platform fee: ${money(gig.ledger.fee)} (8%). Worker net on full release: ${money(gig.ledger.workerNet)}. No real money moves.`,
                      "Fund demo escrow",
                    )
                  }
                >
                  Fund escrow · {money(gig.ledger.amount)}
                </Button>
              ) : (
                <p className="small muted">
                  Waiting for {hirer.name} to fund the simulated escrow.
                </p>
              )}
            </Panel>
          )}
          {gig.status === "In progress" && (
            <Panel>
              <h2>Good work is taking shape.</h2>
              <p>{brief.deliverables}</p>
              <Banner tone="success">
                Demo escrow is funded. Delivery is due{" "}
                {dateLabel(brief.deadline)}.
              </Banner>
              {isWorker ? (
                <DemoDelivery gig={gig} />
              ) : (
                <>
                  <div className="waiting-illustration">
                    <FileCheck2 size={52} />
                  </div>
                  <p className="centered muted">
                    {worker?.name} can attach a demo deliverable and notes.
                    Switch to that worker in Evaluator tools to continue.
                  </p>
                </>
              )}
            </Panel>
          )}
          {gig.status === "Delivered" && (
            <Panel>
              <div className="row between">
                <h2>Ready for a closer look.</h2>
                <FileCheck2 size={24} />
              </div>
              <PortfolioArt
                id={`${gig.id}-delivery`}
                category={worker?.category || "Design & Graphics"}
              />
              <p>{gig.deliveryNote}</p>
              <Banner>
                Demo review window ends{" "}
                {dateLabel(addDays(gig.deliveredAt || state.clock.date, 3))}.{" "}
                {state.clock.date >=
                addDays(gig.deliveredAt || state.clock.date, 3)
                  ? "Review window elapsed."
                  : "Advance the demo date to explore timing."}{" "}
                No automatic release occurs in this prototype.
              </Banner>
              {isHirer && (
                <div className="actions">
                  <Button
                    variant="primary"
                    onClick={() =>
                      ask(
                        { type: "RELEASE", gigId: gig.id },
                        "Approve and release?",
                        `Approve this demo delivery and release ${money(gig.ledger.workerNet)} to the worker after the 8% fee. All money movement is simulated.`,
                        "Approve and release",
                      )
                    }
                  >
                    <Check size={16} />
                    Approve and release
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDialog("dispute");
                      setNote("");
                    }}
                  >
                    <Flag size={15} />
                    Raise dispute
                  </Button>
                </div>
              )}
              {isWorker && (
                <p className="small muted">
                  Your work is with the hirer for review.
                </p>
              )}
            </Panel>
          )}
          {gig.status === "Disputed" && (
            <Panel>
              <Banner tone="danger">
                This engagement is disputed. Demo funds are frozen until an
                evaluator records a decision.
              </Banner>
              <h2>Both sides of the story.</h2>
              <h3>Hirer’s evidence</h3>
              <p>{gig.dispute?.hirerNote}</p>
              <h3>Worker’s evidence</h3>
              <p>{gig.dispute?.workerNote || "No evidence note added yet."}</p>
              {isWorker && (
                <form
                  className="form-stack"
                  onSubmit={(e) => {
                    e.preventDefault();
                    dispatch({ type: "EVIDENCE", gigId: gig.id, note });
                    setNote("");
                  }}
                >
                  <Field
                    label="Your demo evidence note"
                    hint="Use fictional details only. At least 10 characters."
                  >
                    <textarea
                      required
                      minLength={10}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </Field>
                  <Button type="submit">Save worker evidence</Button>
                </form>
              )}
              <hr />
              <p className="row">
                <MessageSquare size={18} />
                Open <strong>Review Desk</strong> in Evaluator tools to resolve
                this demo dispute.
              </p>
              <p className="small muted">
                The evaluator can release, refund or split 50/50. The 8% fee
                applies only to the released portion.
              </p>
            </Panel>
          )}
          {["Released", "Refunded", "Split", "Completed"].includes(
            gig.status,
          ) && (
            <>
              <Panel>
                <div className="row">
                  <CircleCheck className="brand" size={28} />
                  <h2>
                    {gig.status === "Completed"
                      ? "A chapter, completed."
                      : gig.status === "Released"
                        ? "Good work, acknowledged."
                        : gig.status === "Refunded"
                          ? "A clear resolution."
                          : "A fair next step."}
                  </h2>
                </div>
                <p>
                  {gig.dispute?.decision || "The hirer approved this delivery."}{" "}
                  All settlement values below are simulated.
                </p>
                <div className="settlement-summary">
                  <div>
                    <small>Worker received</small>
                    <strong>{money(gig.ledger.workerPaid)}</strong>
                  </div>
                  <div>
                    <small>Hirer refunded</small>
                    <strong>{money(gig.ledger.hirerRefund)}</strong>
                  </div>
                  <div>
                    <small>Platform fee</small>
                    <strong>{money(gig.ledger.feeCollected)}</strong>
                  </div>
                </div>
              </Panel>
              <RatingPanel gig={gig} />
              {certificate ? (
                <Panel>
                  <div className="row">
                    <BadgeCheck className="brand" size={32} />
                    <div className="grow">
                      <h2>A record of work well done.</h2>
                      <p className="small muted">
                        Demo certificate · {certificate.code}
                      </p>
                    </div>
                  </div>
                  <ButtonLink to={`/certificates/${certificate.code}`}>
                    View certificate <ArrowRight size={16} />
                  </ButtonLink>
                </Panel>
              ) : (
                <Banner>
                  {gig.outcome === "Released"
                    ? "The demo certificate appears after both sides leave a rating."
                    : "Refunded and split resolutions do not issue a certificate of completion. The outcome remains in this gig history."}
                </Banner>
              )}
            </>
          )}
        </div>
        <aside className="stack sticky-rail">
          <EscrowPanel gig={gig} />
          <Panel>
            <h3>People behind the project</h3>
            <div className="shortlist-mini">
              <Avatar id={hirer.id} name={hirer.name} size={38} />
              <div>
                <strong>{hirer.name}</strong>
                <span>Hirer · {hirer.company}</span>
              </div>
            </div>
            {worker && (
              <Link className="shortlist-mini" to={`/workers/${worker.id}`}>
                <Avatar id={worker.id} name={worker.name} size={38} />
                <div>
                  <strong>{worker.name}</strong>
                  <span>Worker · {worker.category}</span>
                </div>
              </Link>
            )}
            <p className="small muted">
              All people, documents and money in this workspace are fictional
              demo records.
            </p>
          </Panel>
        </aside>
      </div>
      {confirm && (
        <Confirm
          title={confirm.title}
          confirm={confirm.label}
          onClose={() => setConfirm(undefined)}
          onConfirm={() => dispatch(confirm.action)}
        >
          {confirm.description}
        </Confirm>
      )}
      {dialog && (
        <Modal
          title={
            dialog === "reject"
              ? "Give the trial a clear ending."
              : "Explain the delivery issue."
          }
          onClose={() => setDialog(undefined)}
        >
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(
                dialog === "reject"
                  ? {
                      type: "TRIAL_DECISION",
                      gigId: gig.id,
                      accept: false,
                      reason,
                    }
                  : { type: "DISPUTE", gigId: gig.id, note },
              );
              setDialog(undefined);
            }}
          >
            {dialog === "reject" ? (
              <Field label="Rejection reason">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  {[
                    "Off-brief",
                    "Quality below brief",
                    "Not my style",
                    "Other",
                  ].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            ) : (
              <Field
                label="Hirer’s evidence note"
                hint="Describe the gap against the agreed deliverables. Use demo details only."
              >
                <textarea
                  required
                  minLength={10}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Field>
            )}
            <Banner tone="warning">
              This decision affects local demo state only. No notifications or
              payments are sent.
            </Banner>
            <Button variant="danger" type="submit">
              {dialog === "reject" ? "Reject trial" : "Open demo dispute"}
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
function DemoDelivery({ gig, trial = false }: { gig: Gig; trial?: boolean }) {
  const { dispatch } = useDemo();
  const [attached, setAttached] = useState(false);
  const [note, setNote] = useState("");
  return (
    <form
      className="form-stack delivery-form"
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(
          trial
            ? { type: "TRIAL_UPLOAD", gigId: gig.id, note }
            : { type: "DELIVER", gigId: gig.id, note },
        );
      }}
    >
      <div className="upload-zone compact-upload">
        <Upload size={25} />
        <p>
          {attached
            ? `${trial ? "watermarked-sample" : "final-delivery"}.demo attached`
            : "Attach a fictional sample asset."}
        </p>
        <Button type="button" onClick={() => setAttached(!attached)}>
          {attached ? "Remove demo attachment" : "Attach demo asset"}
        </Button>
        <small>No file is uploaded or read. This uses generated artwork.</small>
      </div>
      <Field
        label={trial ? "Sample notes" : "Delivery notes"}
        hint="At least 10 characters. Describe the demo artifact and its scope."
      >
        <textarea
          required
          minLength={10}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            trial
              ? "One rough direction using the supplied visual references…"
              : "The final demo artwork and editable source are ready for review…"
          }
        />
      </Field>
      <Button variant="primary" type="submit" disabled={!attached}>
        {trial ? "Send watermarked sample" : "Deliver demo work"}
        <ArrowRight size={16} />
      </Button>
      {!attached && (
        <small className="muted">
          Attach the fictional asset to enable delivery.
        </small>
      )}
    </form>
  );
}
function RatingPanel({ gig }: { gig: Gig }) {
  const { state, persona, dispatch } = useDemo();
  const [scores, setScores] = useState([0, 0, 0]);
  const [note, setNote] = useState("");
  const own = gig.ratings.find((r) => r.by === persona.role);
  const relevant =
    (persona.role === "worker" ? gig.workerId : gig.hirerId) === persona.id;
  const visible = gigService.ratingsVisible(state, gig);
  const labels =
    persona.role === "hirer"
      ? ["Quality", "Timeliness", "Communication"]
      : ["Clarity", "Prompt payment", "Communication"];
  const extreme = scores.some((n) => n <= 2 || n === 5);
  return (
    <Panel>
      <h2>The final word goes both ways.</h2>
      <p className="small muted">
        Demo ratings reveal after both sides respond or 3 simulated days after
        settlement. No production reputation system is connected.
      </p>
      {relevant && !own && gig.status !== "Completed" ? (
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({ type: "RATE", gigId: gig.id, scores, note });
          }}
        >
          {labels.map((label, i) => (
            <fieldset className="star-field" key={label}>
              <legend>{label}</legend>
              <div className="star-input">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label
                    key={value}
                    className={scores[i] >= value ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name={`rating-${i}`}
                      aria-label={`${label}: ${value} ${value === 1 ? "star" : "stars"}`}
                      value={value}
                      checked={scores[i] === value}
                      required
                      onChange={() =>
                        setScores((prev) =>
                          prev.map((v, j) => (j === i ? value : v)),
                        )
                      }
                    />
                    <Star
                      size={27}
                      fill={scores[i] >= value ? "currentColor" : "none"}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <Field
            label="A few words about the experience"
            hint="Scores of 1–2 or 5 require a 10–140 character explanation."
          >
            <textarea
              value={note}
              minLength={extreme ? 10 : undefined}
              maxLength={140}
              required={extreme}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
          <Button
            variant="primary"
            type="submit"
            disabled={scores.some((n) => n === 0)}
          >
            Save demo rating
          </Button>
          {scores.some((n) => n === 0) && (
            <small className="muted">
              Rate all three criteria to continue.
            </small>
          )}
        </form>
      ) : (
        own && (
          <Banner tone="success">
            Your rating is saved.{" "}
            {visible
              ? "Ratings are now visible in this demo."
              : "The other side’s feedback remains private for now."}
          </Banner>
        )
      )}
      {visible
        ? gig.ratings.map((r) => (
            <div className="rating-result" key={r.by}>
              <div className="row between">
                <h3>{r.by === "hirer" ? "Hirer" : "Worker"} review</h3>
                <span className="row">
                  <Star size={16} className="gold" />
                  {(r.scores.reduce((a, b) => a + b, 0) / 3).toFixed(1)}/5
                </span>
              </div>
              <p>{r.note || "No written comment."}</p>
              <small className="muted">
                Criteria: {r.scores.join(" / ")} · {dateLabel(r.date)}
              </small>
              {relevant && r.by !== persona.role && (
                <Button
                  variant="quiet"
                  disabled={r.flagged}
                  onClick={() =>
                    dispatch({ type: "FLAG", gigId: gig.id, by: r.by })
                  }
                >
                  <Flag size={14} />
                  {r.flagged
                    ? "Demo appeal recorded"
                    : "Flag rating for demo review"}
                </Button>
              )}
            </div>
          ))
        : gig.ratings.length > 0 && (
            <p className="small muted">
              {gig.ratings.length} of 2 ratings received. Advance the demo clock
              to {dateLabel(addDays(gig.outcomeAt || state.clock.date, 3))} or
              switch to the other party to reveal.
            </p>
          )}
    </Panel>
  );
}
