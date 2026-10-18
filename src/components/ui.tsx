import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CircleDashed,
  Info,
  ShieldCheck,
  ShieldHalf,
  ShieldX,
  X,
} from "lucide-react";
import type { Category, CVClaim, Gig, ProofStatus } from "../data/types";
import { dateLabel, money } from "../data/services";
export function Logo({ large = false }: { large?: boolean }) {
  return (
    <Link
      to="/"
      className={`logo ${large ? "logo-large" : ""}`}
      aria-label="Aura home"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m3 21 9-18 9 18M7 15l4 4 8-9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Aura</span>
    </Link>
  );
}
export function Button({
  children,
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  children: ReactNode;
}) {
  return (
    <button {...props} className={`button ${variant} ${className}`}>
      {children}
    </button>
  );
}
export function ButtonLink({
  to,
  children,
  primary = false,
  className = "",
}: {
  to: string;
  children: ReactNode;
  primary?: boolean;
  className?: string;
}) {
  return (
    <Link
      className={`button ${primary ? "primary" : "secondary"} ${className}`}
      to={to}
    >
      {children}
    </Link>
  );
}
export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`panel ${className}`}>{children}</section>;
}
export function Banner({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "warning" | "danger" | "success";
}) {
  return (
    <div
      className={`banner ${tone}`}
      role={tone === "danger" ? "alert" : undefined}
    >
      <Info size={17} />
      <span>{children}</span>
    </div>
  );
}
export function Field({
  label,
  hint,
  children,
  error,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
      {error && (
        <small className="error" role="alert">
          {error}
        </small>
      )}
    </label>
  );
}
const statusIcon = {
  Verified: ShieldCheck,
  "Partially verified": ShieldHalf,
  "Self-declared": CircleDashed,
  Disproved: ShieldX,
};
export function ProofBadge({ status }: { status: ProofStatus }) {
  const Icon = statusIcon[status];
  return (
    <span
      className={`badge proof-${status.toLowerCase().replaceAll(" ", "-")}`}
      title="Seeded/simulated proof outcome. No live provider check."
    >
      <Icon size={14} />
      {status}
    </span>
  );
}
export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`badge ${/Disputed|Rejected|Refunded/.test(status) ? "negative" : /Completed|Released|Accepted/.test(status) ? "positive" : "neutral-badge"}`}
    >
      <span className="status-dot" />
      {status}
    </span>
  );
}
export function ClaimRing({
  claims,
  score = 76,
  size = "md",
  level = "Silver",
}: {
  claims: CVClaim[];
  score?: number;
  size?: "xs" | "sm" | "md" | "lg";
  level?: string;
}) {
  const widths = { xs: 28, sm: 48, md: 72, lg: 160 };
  const n = claims.length;
  const count = claims.filter((c) => c.status === "Verified").length;
  const colors: Record<ProofStatus, string> = {
    Verified: "var(--emerald-600)",
    "Partially verified": "var(--partial)",
    "Self-declared": "var(--ink-200)",
    Disproved: "var(--danger)",
  };
  return (
    <div
      className={`claim-ring ring-${size}`}
      style={{ width: widths[size], height: widths[size] }}
      role="img"
      aria-label={`Demo Aura Score ${score}, ${level}, ${count} of ${n} claims verified`}
    >
      <svg viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="var(--ink-100)"
          strokeWidth="5"
        />
        {claims.map((claim, i) => {
          const length = Math.max(0, (((360 / n - 3) * Math.PI) / 180) * 44);
          return (
            <circle
              key={claim.id}
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={colors[claim.status]}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${length} ${2 * Math.PI * 44 - length}`}
              transform={`rotate(${(i * 360) / n - 90} 50 50)`}
              tabIndex={size === "lg" ? 0 : undefined}
            >
              <title>
                {claim.text} · {claim.status} · {claim.method}
              </title>
            </circle>
          );
        })}
      </svg>
      {size !== "xs" && (
        <div className="ring-numeral">
          <strong>{score}</strong>
          {size === "lg" && (
            <>
              <span>{level} level</span>
              <small>Demo score</small>
            </>
          )}
        </div>
      )}
    </div>
  );
}
export function Avatar({
  id,
  name,
  size = 48,
}: {
  id: string;
  name: string;
  size?: number;
}) {
  const hash = [...id].reduce((n, c) => n + c.charCodeAt(0), 0);
  return (
    <svg
      className={`avatar avatar-${hash % 4}`}
      width={size}
      height={size}
      viewBox="0 0 80 80"
      role="img"
      aria-label={`${name}, illustrated demo avatar`}
    >
      <circle cx="40" cy="40" r="40" fill="var(--avatar-bg)" />
      <path d="M8 80c0-24 16-32 32-32s32 8 32 32" fill="var(--avatar-shirt)" />
      <path d="M29 46h22v16c-7 8-15 8-22 0" fill="var(--avatar-skin)" />
      <ellipse cx="40" cy="32" rx="19" ry="24" fill="var(--avatar-hair)" />
      <ellipse cx="40" cy="36" rx="16" ry="20" fill="var(--avatar-skin)" />
      <path
        d={
          hash % 2
            ? "M22 33c-4-25 34-36 37 1-11-4-15-10-16-17-6 9-12 15-21 16"
            : "M21 28c1-25 36-27 39 1-12 1-24-3-29-11l-10 10"
        }
        fill="var(--avatar-hair)"
      />
      <path
        d="M32 35h2m12 0h2m-12 11q4 3 8 0"
        stroke="var(--ink-900)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
export function PortfolioArt({
  category,
  id,
  compact = false,
}: {
  category: Category;
  id: string;
  compact?: boolean;
}) {
  const variant = [...id].reduce((n, c) => n + c.charCodeAt(0), 0) % 3;
  return (
    <div
      className={`portfolio-art art-${variant} ${compact ? "compact" : ""}`}
      aria-label={`Generated ${category} portfolio illustration`}
      role="img"
    >
      {category === "Architecture Design" ? (
        <svg viewBox="0 0 400 230">
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M70 30h260v170H70zM70 110h160V30M230 110h100M170 110v90M70 160h100M280 110v90" />
            <path d="M100 50h70v40h-70zM250 50h50v40h-50zM200 135h40v40h-40z" />
          </g>
        </svg>
      ) : category === "Video Editing" ? (
        <div className="video-art">
          <span>
            Between
            <br />
            <em>the frames.</em>
          </span>
          <div className="timeline-bars">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <i key={i} />
            ))}
          </div>
        </div>
      ) : category === "Software" ? (
        <div className="code-art">
          <span>orbit / build with intention</span>
          {[
            "const idea = imagine();",
            "const craft = refine(idea);",
            "return somethingWonderful;",
          ].map((t) => (
            <code key={t}>{t}</code>
          ))}
        </div>
      ) : category === "Web Development" || category === "Vibecoding" ? (
        <div className="browser-art">
          <div>
            <i />
            <i />
            <i />
            <span>made with intention</span>
          </div>
          <section>
            <small>The space to grow.</small>
            <strong>
              Good things
              <br />
              start here.
            </strong>
            <i />
            <aside />
          </section>
        </div>
      ) : category === "Social Media Marketing" ? (
        <div className="social-art">
          <span>
            Small
            <br />
            stories.
          </span>
          <div />
          <span>
            Big
            <br />
            impact.
          </span>
        </div>
      ) : (
        <div className="brand-art">
          <span className="art-caption">Independent by nature.</span>
          <strong>
            {variant === 1 ? "forma" : "kanso"}
            <span>®</span>
          </strong>
          <div className="brand-shapes">
            <i />
            <i />
            <i />
          </div>
          <span className="art-caption">A little less. A little better.</span>
        </div>
      )}
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current!;
    const old = document.activeElement as HTMLElement;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
    return () => {
      dialog.close?.();
      old?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const items = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]',
          ),
        ).filter((el) => el.getClientRects().length > 0);
        const first = items[0];
        const last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <div className="row between">
          <h2 id={titleId}>{title}</h2>
          <Button aria-label="Close dialog" variant="quiet" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function Confirm({
  title,
  children,
  confirm,
  onConfirm,
  onClose,
  danger = false,
}: {
  title: string;
  children: ReactNode;
  confirm: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p>{children}</p>
      <div className="actions end">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant={danger ? "danger" : "primary"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirm}
        </Button>
      </div>
    </Modal>
  );
}
export function Empty({
  title,
  children,
  to,
  action,
}: {
  title: string;
  children: ReactNode;
  to?: string;
  action?: string;
}) {
  return (
    <div className="empty">
      <CircleDashed size={36} />
      <h2>{title}</h2>
      <p>{children}</p>
      {to && (
        <ButtonLink to={to}>
          {action || "Go back"}
          <ArrowRight size={16} />
        </ButtonLink>
      )}
    </div>
  );
}
export function PageTitle({
  title,
  description,
  action,
  eyebrow,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Skeleton() {
  return (
    <div className="skeleton" role="status" aria-label="Loading sample CV">
      <div />
      <div />
      <div />
      <span>Simulating the sample parser…</span>
    </div>
  );
}
export function EscrowPanel({ gig }: { gig: Gig }) {
  const l = gig.ledger;
  return (
    <Panel>
      <div className="row between">
        <h2>Escrow ledger</h2>
        <span className="badge warning">Demo only</span>
      </div>
      <dl className="ledger">
        <div>
          <dt>Agreed amount</dt>
          <dd>{money(l.amount)}</dd>
        </div>
        <div>
          <dt>
            Platform fee <span className="muted">8%</span>
          </dt>
          <dd>{money(l.fee)}</dd>
        </div>
        <div className="ledger-total">
          <dt>Worker net on full release</dt>
          <dd>{money(l.workerNet)}</dd>
        </div>
      </dl>
      <StatusBadge
        status={
          gig.status === "Disputed"
            ? "Disputed · frozen"
            : l.funded
              ? "Funded · simulated"
              : "Not funded"
        }
      />
      {gig.outcome && (
        <dl className="ledger">
          <div>
            <dt>Paid to worker</dt>
            <dd>{money(l.workerPaid)}</dd>
          </div>
          <div>
            <dt>Refunded to hirer</dt>
            <dd>{money(l.hirerRefund)}</dd>
          </div>
          <div>
            <dt>Fee collected</dt>
            <dd>{money(l.feeCollected)}</dd>
          </div>
        </dl>
      )}
      <p className="small muted">
        Simulated payment. In production this goes through a payment gateway.
      </p>
      {l.events.length > 0 && (
        <ul className="event-list">
          {l.events.map((e, i) => (
            <li key={i}>
              <Check size={14} />
              <span>
                {e.text}
                <small>{dateLabel(e.date)}</small>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
export function TrialPreview({
  category = "Design & Graphics",
}: {
  category?: Category;
}) {
  return (
    <div className="trial-preview">
      <PortfolioArt id="trial-demo" category={category} />
      <svg
        className="watermark-svg"
        aria-hidden="true"
        viewBox="0 0 500 300"
        preserveAspectRatio="none"
      >
        <g
          transform="rotate(-25 250 150)"
          fill="var(--ink-900)"
          opacity="0.16"
          fontSize="18"
          fontWeight="600"
          textAnchor="middle"
        >
          <text x="250" y="20">
            AURA SAMPLE · UNPAID PREVIEW
          </text>
          <text x="250" y="75">
            AURA SAMPLE · UNPAID PREVIEW
          </text>
          <text x="250" y="130">
            AURA SAMPLE · UNPAID PREVIEW
          </text>
          <text x="250" y="185">
            AURA SAMPLE · UNPAID PREVIEW
          </text>
          <text x="250" y="240">
            AURA SAMPLE · UNPAID PREVIEW
          </text>
          <text x="250" y="295">
            AURA SAMPLE · UNPAID PREVIEW
          </text>
        </g>
      </svg>
      <span className="preview-label">Preview only. Unpaid. Demo sample.</span>
    </div>
  );
}
export function CopyLink({ value }: { value: string }) {
  const [message, setMessage] = useState("");
  return (
    <div>
      <Button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setMessage("Link copied.");
          } catch {
            setMessage(`Copy this link: ${value}`);
          }
        }}
      >
        Copy demo link
      </Button>
      {message && (
        <p className="small break-word" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
