import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemo } from "../state/DemoContext";
import { claimService, money } from "../data/services";
import type { WorkerProfile } from "../data/types";
import { Avatar, ClaimRing, PortfolioArt } from "./ui";
export function WorkerCard({
  worker,
  deck = false,
  actions = true,
}: {
  worker: WorkerProfile;
  deck?: boolean;
  actions?: boolean;
}) {
  const { state } = useDemo();
  const claims = claimService.forWorker(state, worker.id);
  return (
    <article className={`worker-card ${deck ? "deck-card" : ""}`}>
      <div className="worker-top">
        <Avatar id={worker.id} name={worker.name} size={56} />
        <div className="grow">
          <h2>{worker.name}</h2>
          <span className="small muted">{worker.category}</span>
        </div>
        <ClaimRing claims={claims} score={worker.score} size="sm" />
      </div>
      <div className="row small muted">
        <MapPin size={14} />
        {worker.city}
        <span className="available">
          <i />
          {worker.live ? "Available for work" : "Demo profile draft"}
        </span>
      </div>
      <PortfolioArt
        id={worker.portfolio[0].id}
        category={worker.category}
        compact={!deck}
      />
      <div className="row between">
        <strong>
          {money(worker.rate)}
          <span className="small muted normal"> / hour</span>
        </strong>
        <span className="row small">
          <Star size={15} className="gold" fill="currentColor" />
          {worker.rating} <span className="muted">({worker.ratingCount})</span>
        </span>
      </div>
      <div className="chips">
        {worker.skills.slice(0, 3).map((s) => (
          <span className="chip" key={s}>
            {s}
          </span>
        ))}
      </div>
      <div className="worker-proof">
        <span>
          <strong>
            {claims.filter((c) => c.status === "Verified").length}/
            {claims.length}
          </strong>{" "}
          claims verified <span className="muted">· demo</span>
        </span>
        <span>
          <strong>{worker.completedGigs}</strong> gigs
        </span>
      </div>
      <p className="match-copy">
        Matched on <strong>{worker.category.toLowerCase()}</strong>,{" "}
        {worker.skills[0]} and availability.
      </p>
      {actions && (
        <Link className="profile-link" to={`/workers/${worker.id}`}>
          Open profile <ArrowUpRight size={18} />
        </Link>
      )}
    </article>
  );
}
