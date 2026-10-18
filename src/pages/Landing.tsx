import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Fingerprint,
  Laptop,
  LockKeyhole,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useDemo } from "../state/DemoContext";
import { ClaimRing, PortfolioArt, ProofBadge } from "../components/ui";
import { WorkerCard } from "../components/WorkerCard";
import { claimService } from "../data/services";
export function Landing() {
  const { state } = useDemo();
  const w = state.workers[0];
  const reduced = useReducedMotion();
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="hero-note">
          <span className="tiny-mark">
            <Check size={12} />
          </span>
          Good work deserves to be seen.
        </div>
        <h1>
          Hire people whose work
          <br className="desktop-break" /> you have seen,
          <br className="mobile-break" /> not just
          <br className="desktop-break" /> people who say they can.
        </h1>
        <p className="hero-description">
          From a claim to a collaboration.
          <br />
          Find your people, see their proof, and build something good.
        </p>
        <div className="role-cards">
          <Link className="role-card" to="/onboarding/hirer">
            <span className="role-icon">
              <BriefcaseBusiness size={23} />
            </span>
            <div>
              <strong>I want to hire</strong>
              <span>Find the right person for your next idea.</span>
            </div>
            <ArrowUpRight size={22} />
          </Link>
          <Link className="role-card" to="/onboarding/worker">
            <span className="role-icon">
              <Laptop size={23} />
            </span>
            <div>
              <strong>I want to work</strong>
              <span>Let your work open the next door.</span>
            </div>
            <ArrowUpRight size={22} />
          </Link>
        </div>
        <div className="prototype-note">
          <span className="status-dot" />
          Interactive prototype · All verification and payments are simulated.
        </div>
      </section>
      <motion.section
        className="product-collage"
        aria-label="A preview of the Aura experience"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0.12 : 0.7 }}
      >
        <div className="collage-side collage-proof">
          <div className="row between">
            <span className="row">
              <ShieldCheck size={18} />
              Proof, with context
            </span>
            <span className="small muted">01</span>
          </div>
          <ClaimRing
            claims={claimService.forWorker(state, w.id)}
            score={w.score}
            size="lg"
          />
          <p>
            Behind every claim,
            <br />a clearer picture.
          </p>
          <div className="mini-claim">
            <span>Design degree</span>
            <ProofBadge status="Verified" />
          </div>
          <div className="mini-claim">
            <span>Portfolio authorship</span>
            <ProofBadge status="Partially verified" />
          </div>
          <small className="muted">Illustrative proof outcomes</small>
        </div>
        <div className="collage-worker">
          <span className="floating-label">
            <Sparkles size={14} />
            Your next great collaboration
          </span>
          <WorkerCard worker={w} actions={false} />
          <Link to="/search" className="collage-cta">
            Meet the talent <ArrowRight size={17} />
          </Link>
        </div>
        <div className="collage-right">
          <div className="collage-side collage-trial">
            <div className="row between">
              <span className="row">
                <Play size={16} />A little trial. A lot of clarity.
              </span>
              <span className="small muted">02</span>
            </div>
            <div className="landing-trial-art">
              <PortfolioArt
                category="Design & Graphics"
                id="landing-preview"
                compact
              />
              <svg
                className="landing-watermark-svg"
                aria-hidden="true"
                viewBox="0 0 240 156"
                preserveAspectRatio="none"
              >
                <text
                  x="120"
                  y="78"
                  transform="rotate(-18 120 78)"
                  textAnchor="middle"
                  fill="var(--art-olive)"
                  opacity="0.6"
                  fontSize="10"
                  fontWeight="600"
                >
                  AURA SAMPLE · UNPAID PREVIEW
                </text>
              </svg>
            </div>
            <div className="row between">
              <small>One direction. No commitment.</small>
              <span className="badge positive">
                <Check size={12} />
                Preview only
              </span>
            </div>
          </div>
          <div className="collage-side collage-payment">
            <div className="row between">
              <span className="row">
                <LockKeyhole size={17} />
                Peace of mind, built in.
              </span>
              <span className="small muted">03</span>
            </div>
            <div className="payment-amount">
              ₹22,000<span>Simulated escrow</span>
            </div>
            <div className="row between small">
              <span>8% platform fee</span>
              <strong>₹1,760</strong>
            </div>
            <div className="row between small">
              <span>Worker receives</span>
              <strong>₹20,240</strong>
            </div>
          </div>
        </div>
      </motion.section>
      <section className="how-strip" aria-label="The Aura journey">
        {[
          {
            icon: Fingerprint,
            title: "Verify",
            text: "Claims with context. Evidence you can inspect.",
          },
          {
            icon: Play,
            title: "Try",
            text: "A small, watermarked sample before the big yes.",
          },
          {
            icon: LockKeyhole,
            title: "Pay",
            text: "A transparent path from agreement to delivery.",
          },
          {
            icon: Star,
            title: "Earn",
            text: "Good work becomes a reputation that travels.",
          },
        ].map((s, i) => (
          <Link to="/how-it-works" key={s.title}>
            <span className="step-number">0{i + 1}</span>
            <s.icon size={22} />
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </Link>
        ))}
      </section>
      <footer className="landing-footer">
        <span>
          Aura <span className="muted">by The_neighbourhood</span>
        </span>
        <p>Payments, DigiLocker and OTP are simulated.</p>
        <Link to="/how-it-works#simulated">
          What is simulated <ArrowUpRight size={14} />
        </Link>
      </footer>
    </div>
  );
}
