import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  FileText,
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { personas } from "../data/seed";
import { briefService, dateLabel, workerService } from "../data/services";
import { useDemo } from "../state/DemoContext";
import { Avatar, Banner, Button, Confirm, Logo, Modal } from "./ui";
export const routes = {
  landing: "/",
  search: "/search",
  shortlist: "/shortlist",
  postBrief: "/briefs/new",
  dashboard: "/dashboard",
  cv: "/cv",
  bids: "/bids",
  gigs: "/gigs",
  account: "/account",
  help: "/how-it-works",
};
export function Shell() {
  const { state, persona } = useDemo();
  const [menu, setMenu] = useState(false);
  const [help, setHelp] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setHelp(false);
      }
    };
    const outside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".popover-wrap")) {
        setMenu(false);
        setHelp(false);
      }
    };
    document.addEventListener("keydown", close);
    document.addEventListener("click", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("click", outside);
    };
  }, []);
  useEffect(() => {
    setMenu(false);
    setHelp(false);
    if (loc.hash)
      document
        .getElementById(loc.hash.slice(1))
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    else window.scrollTo?.(0, 0);
  }, [loc.pathname, loc.hash]);
  const profile =
    workerService.get(state, persona.id) ||
    state.hirers.find((h) => h.id === persona.id);
  const nav =
    persona.role === "hirer"
      ? [
          { path: routes.search, label: "Search", icon: Search },
          { path: routes.shortlist, label: "Shortlist", icon: Heart },
          { path: routes.gigs, label: "My gigs", icon: BriefcaseBusiness },
          { path: routes.dashboard, label: "Dashboard", icon: LayoutDashboard },
        ]
      : [
          { path: routes.dashboard, label: "Dashboard", icon: LayoutDashboard },
          { path: routes.cv, label: "My CV", icon: FileText },
          { path: routes.bids, label: "Bids", icon: Search },
          { path: routes.gigs, label: "My gigs", icon: BriefcaseBusiness },
        ];
  const focus =
    loc.pathname === "/" ||
    loc.pathname.startsWith("/onboarding") ||
    loc.pathname === "/interests";
  const standalone = loc.pathname.startsWith("/verify/");
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {!standalone && (
        <header className="app-header">
          <div className="header-inner">
            <Logo />
            {!focus && (
              <nav className="desktop-nav" aria-label="Main navigation">
                {nav.map((n) => (
                  <NavLink key={n.path} to={n.path}>
                    <n.icon size={17} />
                    {n.label}
                    {n.path === routes.shortlist && (
                      <span className="nav-count">
                        {state.shortlist[persona.id]?.length || 0}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            )}
            <div className="header-actions">
              <div className="popover-wrap">
                <Button
                  variant="quiet"
                  aria-label="How Aura works"
                  aria-expanded={help}
                  onClick={() => setHelp(!help)}
                >
                  <HelpCircle size={17} />
                  <span className="hide-small">How Aura works</span>
                  <ChevronDown size={14} />
                </Button>
                {help && (
                  <div className="popover">
                    <Link to="/how-it-works#verification">
                      How verification works
                    </Link>
                    <Link to="/how-it-works#trials">Trials and escrow</Link>
                    <Link to="/how-it-works#ratings">
                      Ratings and Aura Score
                    </Link>
                    <Link to="/how-it-works#simulated">What is simulated</Link>
                  </div>
                )}
              </div>
              {focus ? (
                <Link to="/dashboard" className="header-demo-link">
                  Explore the demo <ArrowRight size={16} />
                </Link>
              ) : (
                <div className="popover-wrap">
                  <button
                    className="avatar-button"
                    aria-label="Open account menu"
                    aria-expanded={menu}
                    onClick={() => setMenu(!menu)}
                  >
                    <Avatar
                      id={persona.id}
                      name={profile?.name || persona.name}
                      size={34}
                    />
                    <ChevronDown size={14} />
                  </button>
                  {menu && (
                    <div className="popover">
                      <div className="popover-meta">
                        <strong>{profile?.name || persona.name}</strong>
                        <span>
                          {persona.role} ·{" "}
                          {state.accountTypes[persona.id] ||
                            persona.accountType}{" "}
                          · demo
                        </span>
                      </div>
                      <Link to="/account">
                        <Settings size={16} />
                        Account
                      </Link>
                      <Link to="/how-it-works">
                        <BookOpen size={16} />
                        Prototype guide
                      </Link>
                      <Link to="/">
                        <LogOut size={16} />
                        Sign out of demo
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
      )}
      <main
        data-route={loc.pathname}
        id="main-content"
        className={`${focus ? "focus-main" : standalone ? "standalone-main" : "workspace"} main-content`}
      >
        <Outlet />
      </main>
      {!focus && !standalone && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {nav.map((n) => (
            <NavLink to={n.path} key={n.path}>
              <n.icon size={20} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
      <DemoBar />
      <Toast />
    </>
  );
}
function Toast() {
  const { state } = useDemo();
  const [closed, setClosed] = useState<number>();
  useEffect(() => {
    const timer = setTimeout(() => setClosed(state.notice?.serial), 4000);
    return () => clearTimeout(timer);
  }, [state.notice]);
  if (!state.notice || closed === state.notice.serial) return null;
  return (
    <div
      className={`toast ${state.notice.error ? "toast-error" : ""}`}
      role={state.notice.error ? "alert" : "status"}
    >
      <span>{state.notice.text}</span>
      <button
        aria-label="Dismiss notification"
        onClick={() => setClosed(state.notice!.serial)}
      >
        <X size={16} />
      </button>
    </div>
  );
}
export function DemoBar() {
  const { state, dispatch, persona } = useDemo();
  const [open, setOpen] = useState(false);
  const [reset, setReset] = useState(false);
  const [review, setReview] = useState(false);
  const [resolve, setResolve] = useState<{
    id: string;
    outcome: "Released" | "Refunded" | "Split";
  }>();
  const navigate = useNavigate();
  const disputes = state.gigs.filter((g) => g.status === "Disputed");
  const controls = (
    <>
      <span className="evaluator-label">
        <SlidersHorizontal size={15} />
        Evaluator tools
      </span>
      <label className="demo-persona">
        <span className="sr-only">Demo persona</span>
        <select
          value={state.personaId}
          onChange={(e) => {
            dispatch({ type: "SWITCH", id: e.target.value });
            setOpen(false);
            navigate("/dashboard");
          }}
        >
          {(["hirer", "worker"] as const).map((role) => (
            <optgroup
              label={role === "hirer" ? "Hirers" : "Workers"}
              key={role}
            >
              {personas
                .filter((p) => p.role === role)
                .map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.name} · {p.role}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </label>
      <span className="demo-date">
        <CalendarDays size={14} />
        {dateLabel(state.clock.date)}
      </span>
      <div className="demo-time">
        {([1, 3, 5] as const).map((days) => (
          <button
            key={days}
            onClick={() => dispatch({ type: "ADVANCE", days })}
          >
            +{days} {days === 1 ? "day" : "days"}
          </button>
        ))}
      </div>
      {disputes.length > 0 && (
        <button
          className="review-desk-button"
          onClick={() => {
            setOpen(false);
            setReview(true);
          }}
        >
          Review Desk <span>{disputes.length}</span>
        </button>
      )}
      <button
        className="demo-reset"
        onClick={() => {
          setOpen(false);
          setReset(true);
        }}
      >
        <RotateCcw size={14} />
        Reset demo
      </button>
    </>
  );
  return (
    <>
      <div className="demo-bar">{controls}</div>
      <button className="evaluator-pill" onClick={() => setOpen(true)}>
        <SlidersHorizontal size={14} />
        Evaluator tools
      </button>
      {open && (
        <Modal title="Evaluator tools" onClose={() => setOpen(false)}>
          <p className="small">
            Demo controls, separate from the product. Current role:{" "}
            {persona.role}.
          </p>
          <div className="demo-mobile-controls">{controls}</div>
        </Modal>
      )}
      {reset && (
        <Confirm
          title="Reset this demo?"
          confirm="Reset demo"
          danger
          onClose={() => setReset(false)}
          onConfirm={() => {
            dispatch({ type: "RESET" });
            navigate("/");
          }}
        >
          Restore all seeded records, personas, claims, briefs, ratings and the
          clock to 18 October 2026. Changes from this session will be lost.
        </Confirm>
      )}
      {review && (
        <Modal title="Aura Review Desk" onClose={() => setReview(false)}>
          <Banner tone="warning">
            Evaluator simulation. No money moves and no real adjudication
            occurs.
          </Banner>
          {disputes.length ? (
            disputes.map((g) => (
              <section className="review-item" key={g.id}>
                <h3>{briefService.get(state, g.briefId)?.title}</h3>
                <p>
                  <strong>Hirer evidence</strong>
                  <br />
                  {g.dispute?.hirerNote}
                </p>
                <p>
                  <strong>Worker evidence</strong>
                  <br />
                  {g.dispute?.workerNote ||
                    "No worker note yet. Switch to the assigned worker to add one."}
                </p>
                <p className="small muted">
                  The 8% fee applies only to the released portion. A full refund
                  has no fee.
                </p>
                <div className="actions">
                  <Button
                    onClick={() =>
                      setResolve({ id: g.id, outcome: "Released" })
                    }
                  >
                    Release to worker
                  </Button>
                  <Button
                    onClick={() =>
                      setResolve({ id: g.id, outcome: "Refunded" })
                    }
                  >
                    Refund to hirer
                  </Button>
                  <Button
                    onClick={() => setResolve({ id: g.id, outcome: "Split" })}
                  >
                    Split 50/50
                  </Button>
                </div>
              </section>
            ))
          ) : (
            <p>No unresolved disputes remain.</p>
          )}
        </Modal>
      )}
      {resolve && (
        <Confirm
          title="Apply simulated decision?"
          confirm={`Confirm ${resolve.outcome.toLowerCase()}`}
          onClose={() => setResolve(undefined)}
          onConfirm={() =>
            dispatch({
              type: "RESOLVE",
              gigId: resolve.id,
              outcome: resolve.outcome,
            })
          }
        >
          This records the evaluator decision and updates the demo ledger. The
          gross amount is split before the 8% fee when choosing 50/50.
        </Confirm>
      )}
    </>
  );
}
