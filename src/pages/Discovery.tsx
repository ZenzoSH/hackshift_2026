import { useState, type KeyboardEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Columns3,
  Heart,
  LayoutList,
  Layers,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useDemo } from "../state/DemoContext";
import { categories } from "../data/types";
import { claimService, money, workerService } from "../data/services";
import {
  Avatar,
  Banner,
  Button,
  ButtonLink,
  Empty,
  Field,
  Modal,
  PageTitle,
  Panel,
} from "../components/ui";
import { WorkerCard } from "../components/WorkerCard";
import { categoryIcons } from "./Onboarding";
export function Discovery() {
  const { state, dispatch, persona } = useDemo();
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [mode, setMode] = useState("Deck");
  const [index, setIndex] = useState(0);
  const [compare, setCompare] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [history, setHistory] = useState<
    { index: number; ids: string[]; priorities: string[] }[]
  >([]);
  const reduced = useReducedMotion();
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, (value) =>
    Math.max(-14, Math.min(14, value / 18)),
  );
  const results = workerService.search(state, query, category);
  const current = results[index];
  const shortlist = state.shortlist[persona.id] || [];
  const priority = state.priority[persona.id] || [];
  function act(kind: "skip" | "add" | "priority") {
    if (!current) return;
    setHistory((prev) => [
      ...prev,
      { index, ids: [...shortlist], priorities: [...priority] },
    ]);
    if (kind !== "skip")
      dispatch({ type: "SHORTLIST", workerId: current.id, mode: kind });
    setIndex((i) => i + 1);
  }
  function undo() {
    const h = history.at(-1);
    if (h) {
      setIndex(h.index);
      dispatch({
        type: "RESTORE_SHORTLIST",
        ids: h.ids,
        priorities: h.priorities,
      });
      setHistory((prev) => prev.slice(0, -1));
    }
  }
  function keys(e: KeyboardEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button,a,input,select")) return;
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "z", "Z", "Enter"].includes(e.key)
    ) {
      e.preventDefault();
      if (e.key === "ArrowLeft") act("skip");
      if (e.key === "ArrowRight") act("add");
      if (e.key === "ArrowUp") act("priority");
      if (e.key.toLowerCase() === "z") undo();
      if (e.key === "Enter" && current)
        window.location.hash = `/workers/${current.id}`;
    }
  }
  const filters = (
    <>
      <h3>Find your people</h3>
      <p className="small muted">A good fit starts with the work.</p>
      <div className="category-filters">
        <button
          className={!category ? "selected" : ""}
          onClick={() => {
            setCategory("");
            setIndex(0);
            setHistory([]);
          }}
        >
          <Layers size={17} />
          All categories{!category && <Check size={15} />}
        </button>
        {categories.map((c, i) => {
          const Icon = categoryIcons[i];
          return (
            <button
              key={c}
              className={category === c ? "selected" : ""}
              onClick={() => {
                setCategory(c);
                setIndex(0);
                setHistory([]);
                setFilterOpen(false);
              }}
            >
              <Icon size={17} />
              {c}
              {category === c && <Check size={15} />}
            </button>
          );
        })}
      </div>
      <div className="filter-foot">
        <ShieldNote />
      </div>
    </>
  );
  return (
    <>
      <PageTitle
        eyebrow="Discover your next collaborator"
        title="Good people. Proven possibilities."
        description="Look beyond the pitch. Find the skills, the work, and the person behind it."
        action={
          <ButtonLink to="/briefs/new">
            Post a brief <ArrowRight size={16} />
          </ButtonLink>
        }
      />
      <div className="search-toolbar">
        <div className="search-input">
          <Search size={20} />
          <label className="sr-only" htmlFor="worker-search">
            Search workers
          </label>
          <input
            id="worker-search"
            placeholder="Try ‘brand identity’, ‘React’, or a city"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
              setHistory([]);
            }}
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setIndex(0);
              }}
            >
              <X size={17} />
            </button>
          )}
        </div>
        <div className="segmented mode-switch">
          {[
            { name: "Deck", icon: Layers },
            { name: "List", icon: LayoutList },
            { name: "Compare", icon: Columns3 },
          ].map((m) => (
            <Button
              key={m.name}
              aria-pressed={mode === m.name}
              onClick={() => setMode(m.name)}
            >
              <m.icon size={16} />
              {m.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="suggestions">
        <span className="small muted">A little inspiration</span>
        {["Design & Graphics", "Web Development", "Video Editing"].map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              setQuery("");
              setIndex(0);
              setHistory([]);
            }}
          >
            {c}
            <ArrowRight size={12} />
          </button>
        ))}
        <Button
          className="mobile-filter-button"
          onClick={() => setFilterOpen(true)}
        >
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </div>
      <div
        className={`discovery-grid ${mode !== "Deck" ? "wide-results" : ""}`}
      >
        <aside className="filter-rail">{filters}</aside>
        <section className="results-area">
          <div className="row between results-header">
            <span>
              <strong>{results.length}</strong> people to discover
            </span>
            <span className="small muted">Curated demo profiles</span>
          </div>
          {!results.length ? (
            <Empty title="A different search could be the start." to="/search">
              No demo profiles match. Clear the search or choose another
              category.
            </Empty>
          ) : mode === "Deck" ? (
            <>
              <div
                className="deck"
                tabIndex={0}
                aria-label="Worker deck: left skip, right shortlist, up priority, Z undo, Enter open profile"
                onKeyDown={keys}
              >
                {current ? (
                  <>
                    <div className="deck-back back-two" />
                    <div className="deck-back back-one" />
                    <motion.div
                      key={current.id}
                      style={{ x: dragX, rotate: reduced ? 0 : rotate }}
                      drag={reduced ? false : true}
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.65}
                      onDragEnd={(_, info) => {
                        if (info.offset.y < -110) act("priority");
                        else if (info.offset.x > 120 || info.velocity.x > 500)
                          act("add");
                        else if (info.offset.x < -120 || info.velocity.x < -500)
                          act("skip");
                      }}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 32,
                      }}
                    >
                      <WorkerCard worker={current} deck />
                    </motion.div>
                  </>
                ) : (
                  <Panel>
                    <Empty
                      title="You’ve met everyone here."
                      action="View your shortlist"
                      to="/shortlist"
                    >
                      A good shortlist is a great beginning. You can also
                      revisit the deck.
                    </Empty>
                    <Button
                      onClick={() => {
                        setIndex(0);
                        setHistory([]);
                      }}
                    >
                      Start the deck again
                    </Button>
                  </Panel>
                )}
              </div>
              <div className="deck-actions">
                <button
                  disabled={!current}
                  className="deck-action skip"
                  aria-label="Skip worker"
                  title="Skip · Left arrow"
                  onClick={() => act("skip")}
                >
                  <X size={26} />
                </button>
                <button
                  disabled={!current || persona.role !== "hirer"}
                  className="deck-action priority"
                  aria-label="Prioritise worker"
                  title="Priority · Up arrow"
                  onClick={() => act("priority")}
                >
                  <Star size={22} />
                </button>
                <button
                  disabled={!current || persona.role !== "hirer"}
                  className="deck-action shortlist"
                  aria-label="Shortlist worker"
                  title="Shortlist · Right arrow"
                  onClick={() => act("add")}
                >
                  <Heart size={25} />
                </button>
              </div>
              {persona.role !== "hirer" && (
                <p className="small muted centered">
                  Switch to a hirer in Evaluator tools to shortlist.
                </p>
              )}
              <div className="deck-footer">
                <Button
                  variant="quiet"
                  disabled={!history.length}
                  onClick={undo}
                >
                  <RotateCcw size={14} />
                  Undo
                </Button>
                <span className="small muted">
                  {Math.min(index + 1, results.length)} of {results.length}
                </span>
                <span className="small muted keyboard-hint">
                  <ArrowLeft size={12} /> Skip <ArrowRight size={12} />{" "}
                  Shortlist
                </span>
              </div>
            </>
          ) : mode === "List" ? (
            <div className="worker-list-grid">
              {results.map((w) => (
                <div key={w.id}>
                  <WorkerCard worker={w} />
                  <div className="list-card-actions">
                    <Button
                      disabled={persona.role !== "hirer"}
                      onClick={() =>
                        dispatch({
                          type: "SHORTLIST",
                          workerId: w.id,
                          mode: shortlist.includes(w.id) ? "remove" : "add",
                        })
                      }
                    >
                      <Heart size={16} />
                      {shortlist.includes(w.id)
                        ? "Remove from shortlist"
                        : "Shortlist"}
                    </Button>
                    <Button
                      aria-pressed={compare.includes(w.id)}
                      onClick={() =>
                        setCompare((prev) =>
                          prev.includes(w.id)
                            ? prev.filter((id) => id !== w.id)
                            : prev.length < 3
                              ? [...prev, w.id]
                              : prev,
                        )
                      }
                      disabled={!compare.includes(w.id) && compare.length >= 3}
                      title="Compare up to three people"
                    >
                      {compare.includes(w.id) ? (
                        <Check size={16} />
                      ) : (
                        <Columns3 size={16} />
                      )}
                      Compare
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="small muted">
                Choose up to three people. Comparison uses the same filtered
                profiles as Deck and List.
              </p>
              <div className="compare-picker">
                {results.map((w) => (
                  <label key={w.id}>
                    <input
                      type="checkbox"
                      checked={compare.includes(w.id)}
                      disabled={!compare.includes(w.id) && compare.length >= 3}
                      onChange={(e) =>
                        setCompare((prev) =>
                          e.target.checked
                            ? [...prev, w.id]
                            : prev.filter((id) => id !== w.id),
                        )
                      }
                    />
                    {w.name}
                  </label>
                ))}
              </div>
              <div className="compare-grid">
                {results
                  .filter((w) => compare.includes(w.id))
                  .map((w) => (
                    <Panel key={w.id}>
                      <Avatar id={w.id} name={w.name} size={56} />
                      <h2>{w.name}</h2>
                      <dl className="compare-facts">
                        <div>
                          <dt>Verified claims · demo</dt>
                          <dd>
                            {
                              claimService
                                .forWorker(state, w.id)
                                .filter((c) => c.status === "Verified").length
                            }
                            /{claimService.forWorker(state, w.id).length}
                          </dd>
                        </div>
                        <div>
                          <dt>Hourly rate</dt>
                          <dd>{money(w.rate)}</dd>
                        </div>
                        <div>
                          <dt>Rating</dt>
                          <dd>{w.rating} / 5</dd>
                        </div>
                        <div>
                          <dt>Completed gigs</dt>
                          <dd>{w.completedGigs}</dd>
                        </div>
                        <div>
                          <dt>Skills</dt>
                          <dd>{w.skills.join(", ")}</dd>
                        </div>
                      </dl>
                      <ButtonLink to={`/workers/${w.id}`}>
                        Open profile
                      </ButtonLink>
                    </Panel>
                  ))}
              </div>
              {!results.some((w) => compare.includes(w.id)) && (
                <Empty title="Make room for a comparison">
                  Select up to three workers above.
                </Empty>
              )}
            </>
          )}
        </section>
        {mode === "Deck" && (
          <aside className="shortlist-rail">
            <div className="row between">
              <h3>Your shortlist</h3>
              <span className="badge neutral-badge">{shortlist.length}</span>
            </div>
            <p className="small muted">People worth a conversation.</p>
            {shortlist.slice(0, 4).map((id) => {
              const w = workerService.get(state, id)!;
              return (
                <Link className="shortlist-mini" to={`/workers/${id}`} key={id}>
                  <Avatar id={id} name={w.name} size={38} />
                  <div>
                    <strong>{w.name}</strong>
                    <span>{w.category}</span>
                  </div>
                  {priority.includes(id) && <Star className="gold" size={14} />}
                </Link>
              );
            })}
            {!shortlist.length && (
              <p className="small">
                Tap the heart on someone who catches your eye.
              </p>
            )}
            <Link className="text-link" to="/shortlist">
              View shortlist <ArrowRight size={14} />
            </Link>
            <div className="discovery-tip">
              <span className="small">A better first step</span>
              <h3>
                See the proof.
                <br />
                Meet the person.
              </h3>
              <p>
                Every Claim Ring tells a story. Open a profile to read what’s
                behind each arc.
              </p>
            </div>
          </aside>
        )}
      </div>
      {filterOpen && (
        <Modal title="Filter people" onClose={() => setFilterOpen(false)}>
          {filters}
          <Field label="Search keyword">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIndex(0);
              }}
            />
          </Field>
        </Modal>
      )}
    </>
  );
}
function ShieldNote() {
  return (
    <Banner>
      Proof statuses describe evidence, not a person’s potential. All outcomes
      here are simulated.
    </Banner>
  );
}
export function Shortlist() {
  const { state, persona, dispatch } = useDemo();
  const priorities = state.priority[persona.id] || [];
  const ids = [...(state.shortlist[persona.id] || [])].sort(
    (a, b) => Number(priorities.includes(b)) - Number(priorities.includes(a)),
  );
  return (
    <>
      <PageTitle
        eyebrow="From possibilities to people"
        title="Your shortlist"
        description="A few good people. One next step."
        action={
          ids.length > 0 && (
            <ButtonLink to="/briefs/new" primary>
              Post a brief <ArrowRight size={16} />
            </ButtonLink>
          )
        }
      />
      {!ids.length ? (
        <Empty
          title="Your next collaborator is out there."
          to="/search"
          action="Discover workers"
        >
          Shortlist someone in discovery, then invite them to a focused brief.
        </Empty>
      ) : (
        <div className="shortlist-page">
          {ids.map((id) => {
            const w = workerService.get(state, id)!;
            return (
              <Panel key={id}>
                <div className="row shortlist-row">
                  <Avatar id={id} name={w.name} size={56} />
                  <div className="grow">
                    <Link to={`/workers/${id}`}>
                      <h2>{w.name}</h2>
                    </Link>
                    <p className="small muted">
                      {w.category} · {w.city}
                    </p>
                    <div className="chips">
                      {w.skills.map((s) => (
                        <span className="chip" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>{money(w.rate)}/hr</strong>
                    <p className="small muted">
                      {w.rating} / 5 · {w.completedGigs} gigs
                    </p>
                  </div>
                  <Button
                    disabled={priorities.includes(id)}
                    onClick={() =>
                      dispatch({
                        type: "SHORTLIST",
                        workerId: id,
                        mode: "priority",
                      })
                    }
                  >
                    <Star size={16} />
                    {priorities.includes(id) ? "Priority" : "Prioritise"}
                  </Button>
                  <Button
                    variant="quiet"
                    aria-label={`Remove ${w.name}`}
                    onClick={() =>
                      dispatch({
                        type: "SHORTLIST",
                        workerId: id,
                        mode: "remove",
                      })
                    }
                  >
                    <X size={18} />
                  </Button>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}
