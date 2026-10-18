import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  FileText,
  Heart,
  Link as LinkIcon,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { useDemo } from "../state/DemoContext";
import {
  claimService,
  dateLabel,
  money,
  workerService,
} from "../data/services";
import type { CVClaim, WorkerProfile } from "../data/types";
import {
  Avatar,
  Banner,
  Button,
  ButtonLink,
  ClaimRing,
  Confirm,
  Empty,
  Field,
  Modal,
  PageTitle,
  Panel,
  PortfolioArt,
  ProofBadge,
  Skeleton,
} from "../components/ui";
export function ClaimsList({
  workerId,
  editable = false,
}: {
  workerId: string;
  editable?: boolean;
}) {
  const { state, dispatch } = useDemo();
  const claims = claimService.forWorker(state, workerId);
  const [dialog, setDialog] = useState<{
    mode: "edit" | "proof" | "verify" | "delete";
    claim: CVClaim;
  }>();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  function show(mode: "edit" | "proof" | "verify" | "delete", claim: CVClaim) {
    setDialog({ mode, claim });
    setText(
      mode === "edit"
        ? claim.text
        : claim.evidence.url || "https://portfolio.example.test/project",
    );
    setError("");
  }
  return (
    <>
      <div className="claims-list">
        {claims.map((c) => (
          <article className="claim-row" key={c.id}>
            <div className="row between wrap">
              <span className="claim-type">
                <FileText size={15} />
                {c.type}
              </span>
              <ProofBadge status={c.status} />
            </div>
            <h3>{c.text}</h3>
            <p className="small muted">
              {c.method} · {dateLabel(c.date)}
            </p>
            <details>
              <summary>What the evidence says</summary>
              <dl className="evidence-facts">
                <div>
                  <dt>Artifact existence</dt>
                  <dd>{c.evidence.artifact}</dd>
                </div>
                <div>
                  <dt>Contribution / authorship</dt>
                  <dd>{c.evidence.contribution}</dd>
                </div>
                <div>
                  <dt>Client / project relationship</dt>
                  <dd>{c.evidence.relationship}</dd>
                </div>
                {c.evidence.url && (
                  <div>
                    <dt>Illustrative proof URL</dt>
                    <dd className="break-word">
                      {c.evidence.url} (not fetched)
                    </dd>
                  </div>
                )}
              </dl>
            </details>
            {editable && (
              <div className="claim-actions">
                <Button variant="quiet" onClick={() => show("verify", c)}>
                  <ShieldCheck size={15} />
                  Demo verification
                </Button>
                <Button variant="quiet" onClick={() => show("proof", c)}>
                  <LinkIcon size={14} />
                  Add proof link
                </Button>
                <Button
                  variant="quiet"
                  aria-label={`Edit claim: ${c.text}`}
                  onClick={() => show("edit", c)}
                >
                  <Pencil size={14} />
                  Edit
                </Button>
                <Button
                  variant="quiet"
                  aria-label={`Delete claim: ${c.text}`}
                  onClick={() => show("delete", c)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            )}
          </article>
        ))}
      </div>
      {!claims.length && (
        <Empty title="A clean page for your experience">
          Load the sample CV above to restore the demo claims.
        </Empty>
      )}
      {dialog?.mode === "delete" ? (
        <Confirm
          title="Delete this demo claim?"
          confirm="Delete claim"
          danger
          onClose={() => setDialog(undefined)}
          onConfirm={() =>
            dispatch({ type: "DELETE_CLAIM", id: dialog.claim.id })
          }
        >
          {dialog.claim.text} will be removed from this session.
        </Confirm>
      ) : (
        dialog && (
          <Modal
            title={
              dialog.mode === "edit"
                ? "Edit your claim"
                : dialog.mode === "proof"
                  ? "Add an illustrative proof link"
                  : "Explore demo verification"
            }
            onClose={() => setDialog(undefined)}
          >
            {dialog.mode === "verify" ? (
              <>
                <Banner tone="warning">
                  Every option is a simulated outcome. No external provider is
                  contacted.
                </Banner>
                <p>
                  A public URL or account ownership alone does not establish
                  contribution or a client relationship.
                </p>
                <div className="verification-options">
                  {[
                    {
                      method: "DigiLocker credential",
                      label: "Verify via DigiLocker",
                      description:
                        "Simulate an education credential. Other claim types stay partial.",
                    },
                    {
                      method: "Account ownership",
                      label: "Check account ownership",
                      description:
                        "Simulate control of an account; this does not prove authorship.",
                    },
                    {
                      method: "Client confirmation",
                      label: "Ask a client to confirm",
                      description:
                        "Simulate independent contribution and relationship confirmation for a project.",
                    },
                  ].map((m) => (
                    <Button
                      key={m.method}
                      onClick={() => {
                        dispatch({
                          type: "VERIFY_CLAIM",
                          id: dialog.claim.id,
                          method: m.method,
                        });
                        setDialog(undefined);
                      }}
                    >
                      <ShieldCheck size={20} />
                      <span>
                        <strong>{m.label}</strong>
                        <small>{m.description}</small>
                      </span>
                      <ArrowRight size={16} />
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (dialog.mode === "edit") {
                    if (text.trim().length < 10)
                      return setError(
                        "Describe the claim in at least 10 characters.",
                      );
                    dispatch({ type: "EDIT_CLAIM", id: dialog.claim.id, text });
                  } else {
                    try {
                      const url = new URL(text);
                      if (!["https:", "http:"].includes(url.protocol))
                        throw new Error();
                    } catch {
                      return setError("Enter a valid http or https URL.");
                    }
                    dispatch({ type: "PROOF", id: dialog.claim.id, url: text });
                  }
                  setDialog(undefined);
                }}
              >
                <Field
                  label={
                    dialog.mode === "edit" ? "Claim text" : "Sample proof URL"
                  }
                  hint={
                    dialog.mode === "edit"
                      ? "Editing resets the claim to Self-declared so an old proof outcome is not attached to a changed claim."
                      : "Use a fictional URL. It is stored only in memory, never fetched. A URL alone does not prove authorship."
                  }
                  error={error}
                >
                  {dialog.mode === "edit" ? (
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                      minLength={10}
                    />
                  ) : (
                    <input
                      type="url"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                    />
                  )}
                </Field>
                <Button variant="primary" type="submit">
                  {dialog.mode === "edit"
                    ? "Save claim"
                    : "Attach demo proof link"}
                </Button>
              </form>
            )}
          </Modal>
        )
      )}
    </>
  );
}
export function CV() {
  const { state, persona, dispatch } = useDemo();
  const worker = workerService.get(state, persona.id);
  const [loading, setLoading] = useState(false);
  const [parse, setParse] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  if (!worker)
    return (
      <Empty title="A worker’s story starts here">
        Switch to a worker persona in Evaluator tools to edit My CV.
      </Empty>
    );
  const claims = claimService.forWorker(state, worker.id);
  function loadSample() {
    setLoading(true);
    timer.current = setTimeout(() => {
      dispatch({ type: "PARSE" });
      setLoading(false);
    }, 700);
  }
  return (
    <>
      <PageTitle
        eyebrow="Your experience, with evidence"
        title="My CV"
        description="Make the work behind your words visible."
        action={
          <ButtonLink to={`/workers/${worker.id}`}>
            Preview public profile <ArrowRight size={16} />
          </ButtonLink>
        }
      />
      <div className="split-layout">
        <div className="stack">
          <div className="upload-zone">
            <div className="upload-icon">
              <Upload size={25} />
            </div>
            <h2>Start with your story.</h2>
            <p>
              Load our sample .docx to explore the claim-by-claim experience.
            </p>
            <Button disabled={loading} onClick={() => setParse(true)}>
              <Plus size={16} />
              {loading ? "Loading sample…" : "Load sample CV (.docx)"}
            </Button>
            <small>
              No real file selection, upload or parsing. Sample records only.
            </small>
          </div>
          <div className="row between">
            <h2>
              Your claims <span className="count-label">{claims.length}</span>
            </h2>
            <span className="small muted">Every claim has its own proof.</span>
          </div>
          <Banner>
            Missing evidence means Self-declared, not Disproved. A negative
            status requires an explicit contradiction.
          </Banner>
          <Panel className="flush">
            {loading ? (
              <Skeleton />
            ) : (
              <ClaimsList workerId={worker.id} editable />
            )}
          </Panel>
        </div>
        <aside className="stack sticky-rail">
          <Panel className="trust-card">
            <span className="eyebrow">Your trust snapshot</span>
            <ClaimRing
              claims={claims}
              score={worker.score}
              level={worker.level}
              size="lg"
            />
            <h2>
              {claims.filter((c) => c.status === "Verified").length} of{" "}
              {claims.length} claims verified
            </h2>
            <p className="small muted">
              Illustrative Aura Score. Seeded proof outcomes are not real
              verification.
            </p>
            <div className="proof-legend">
              {(
                [
                  "Verified",
                  "Partially verified",
                  "Self-declared",
                  "Disproved",
                ] as const
              ).map((s) => (
                <ProofBadge key={s} status={s} />
              ))}
            </div>
          </Panel>
          <Panel>
            <h3>A statement you stand behind.</h3>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={worker.declaration}
                onChange={(e) =>
                  dispatch({ type: "DECLARE", signed: e.target.checked })
                }
              />
              <span>
                I sign this demo declaration that these sample claims represent
                my demo profile. No real legal signature is collected.
              </span>
            </label>
            <Button
              variant="primary"
              className="full-width"
              disabled={!worker.declaration || worker.live}
              onClick={() => dispatch({ type: "LIVE" })}
            >
              {worker.live ? (
                <>
                  <Check size={16} />
                  Live in demo discovery
                </>
              ) : (
                <>
                  Go live in discovery <ArrowRight size={16} />
                </>
              )}
            </Button>
            <p className="small muted">
              {!worker.declaration
                ? "Sign the declaration to enable going live."
                : worker.live
                  ? "This sample profile is marked live for this session."
                  : "Declaration signed. Your profile is ready."}
            </p>
          </Panel>
        </aside>
      </div>
      {parse && (
        <Confirm
          title="Load the sample CV?"
          confirm="Load sample CV"
          onClose={() => setParse(false)}
          onConfirm={loadSample}
        >
          This replaces this worker’s current demo claims with five sample
          claims. No real file is accessed.
        </Confirm>
      )}
    </>
  );
}
function TrustSummary({ worker }: { worker: WorkerProfile }) {
  const { state, persona, dispatch } = useDemo();
  const claims = claimService.forWorker(state, worker.id);
  const shortlisted = (state.shortlist[persona.id] || []).includes(worker.id);
  return (
    <Panel className="trust-card">
      <span className="eyebrow">The story behind the score</span>
      <ClaimRing claims={claims} score={worker.score} size="lg" />
      <h2>{worker.level} · Aura Score preview</h2>
      <dl className="ledger">
        <div>
          <dt>Verified claims · demo</dt>
          <dd>
            {claims.filter((c) => c.status === "Verified").length}/
            {claims.length}
          </dd>
        </div>
        <div>
          <dt>Completed gigs on Aura</dt>
          <dd>{worker.completedGigs}</dd>
        </div>
        <div>
          <dt>Average rating</dt>
          <dd>{worker.rating}/5</dd>
        </div>
        <div>
          <dt>On-time delivery</dt>
          <dd>{worker.onTime}%</dd>
        </div>
        <div>
          <dt>Current streak</dt>
          <dd>{worker.streak}/11</dd>
        </div>
      </dl>
      <p className="small muted">
        Seeded metrics, not an externally validated ranking.
      </p>
      {persona.role === "hirer" && (
        <Button
          className="full-width"
          variant="primary"
          onClick={() =>
            dispatch({
              type: "SHORTLIST",
              workerId: worker.id,
              mode: shortlisted ? "remove" : "add",
            })
          }
        >
          <Heart size={16} />
          {shortlisted ? "Remove from shortlist" : "Shortlist worker"}
        </Button>
      )}
    </Panel>
  );
}
export function WorkerProfilePage() {
  const { id = "" } = useParams();
  const { state } = useDemo();
  const worker = workerService.get(state, id);
  const [portfolio, setPortfolio] = useState<string>();
  if (!worker)
    return (
      <Empty
        title="This profile isn’t in the demo."
        to="/search"
        action="Discover workers"
      >
        Choose one of the seeded workers to inspect their work and claims.
      </Empty>
    );
  return (
    <>
      <div className="profile-heading">
        <Avatar id={worker.id} name={worker.name} size={88} />
        <div className="grow">
          <span className="eyebrow">Independent talent · Demo profile</span>
          <h1>{worker.name}</h1>
          <p>
            {worker.category} <span className="muted">·</span>{" "}
            <MapPin size={14} /> {worker.city}
          </p>
          <div className="chips">
            {worker.skills.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="profile-rate">
          <strong>
            {money(worker.rate)}
            <span> / hour</span>
          </strong>
          <p className="row">
            <Star size={16} className="gold" />
            {worker.rating}{" "}
            <span className="muted">({worker.ratingCount} ratings)</span>
          </p>
        </div>
      </div>
      <div className="split-layout">
        <div className="stack">
          <Panel>
            <h2>A little about me</h2>
            <p>{worker.bio}</p>
          </Panel>
          <section>
            <div className="row between">
              <h2>Selected work</h2>
              <span className="small muted">Code-generated demo portfolio</span>
            </div>
            <div className="portfolio-grid">
              {worker.portfolio.map((p) => (
                <button
                  className="portfolio-button"
                  key={p.id}
                  onClick={() => setPortfolio(p.id)}
                >
                  <PortfolioArt id={p.id} category={p.category} />
                  <strong>{p.title}</strong>
                  <span>
                    {p.category} <ArrowRight size={14} />
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section>
            <h2>Claims & evidence</h2>
            <p className="muted small">
              Proof outcomes are seeded simulations. Artifact existence is
              separate from authorship and client relationships.
            </p>
            <Panel className="flush">
              <ClaimsList workerId={worker.id} />
            </Panel>
          </section>
          <Panel>
            <h2>What collaborators say</h2>
            <div className="row">
              <Star className="gold" size={18} />
              <strong>{worker.rating} out of 5</strong>
              <span className="muted small">Seeded demo review</span>
            </div>
            <blockquote>
              “Thoughtful craft, clear communication, and a genuine care for the
              details.”
            </blockquote>
            <p className="small muted">
              Arjun · Kanso Studio · Demo engagement
            </p>
            {["Quality", "Timeliness", "Communication"].map((c, i) => (
              <div className="rating-bar" key={c}>
                <span>{c}</span>
                <progress max={5} value={i === 1 ? 4 : 5} />
                <strong>{i === 1 ? "4.0" : "5.0"}</strong>
              </div>
            ))}
          </Panel>
          <Banner tone={worker.declaration ? "success" : "neutral"}>
            {worker.declaration
              ? "Demo declaration signed. This is a worker statement, not independent proof of every claim."
              : "This worker has not signed the demo declaration yet."}
          </Banner>
        </div>
        <aside className="stack sticky-rail">
          <TrustSummary worker={worker} />
          <Banner>
            <Sparkles size={16} />A portfolio shows the work. Evidence helps
            explain the contribution.
          </Banner>
        </aside>
      </div>
      {portfolio && (
        <Modal
          title={worker.portfolio.find((p) => p.id === portfolio)!.title}
          onClose={() => setPortfolio(undefined)}
        >
          <PortfolioArt id={portfolio} category={worker.category} />
          <p>{worker.portfolio.find((p) => p.id === portfolio)!.caption}</p>
          <Banner>
            Generated demo artwork. No authorship or real client relationship is
            established by this preview.
          </Banner>
        </Modal>
      )}
    </>
  );
}
