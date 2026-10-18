import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CreditCard,
  Download,
  ShieldCheck,
  User,
} from "lucide-react";
import { useDemo } from "../state/DemoContext";
import { certificateService, dateLabel, workerService } from "../data/services";
import {
  Avatar,
  Banner,
  Button,
  ButtonLink,
  Confirm,
  CopyLink,
  Empty,
  Field,
  Logo,
  PageTitle,
  Panel,
} from "../components/ui";
export function CertificatePage({ verify = false }: { verify?: boolean }) {
  const { code = "" } = useParams();
  const { state, dispatch } = useDemo();
  const certificate = certificateService.lookup(state, code);
  if (!certificate)
    return (
      <div className="certificate-page">
        <Logo />
        <Empty
          title="Certificate not found"
          to="/verify/AURA-2026-0001"
          action="View a sample certificate"
        >
          This code is not in the current demo dataset. Try AURA-2026-0001.
          Newly created certificates disappear when the demo resets.
        </Empty>
      </div>
    );
  const worker = workerService.get(state, certificate.workerId)!;
  const hirer = state.hirers.find((h) => h.id === certificate.hirerId)!;
  const link = `${window.location.origin}${window.location.pathname}#/verify/${certificate.code}`;
  function download() {
    if (!certificate) return;
    const card = document.querySelector(".certificate-card");
    if (!card) return;
    const escape = (text: string) =>
      text.replace(
        /[<>&"']/g,
        (c) =>
          ({
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
          })[c]!,
      );
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="720" viewBox="0 0 900 720"><rect width="900" height="720" fill="#ffffff"/><rect x="24" y="24" width="852" height="672" rx="12" fill="none" stroke="#0E7C59" stroke-width="2"/><g fill="#16211C" text-anchor="middle" font-family="Georgia,serif"><text x="450" y="92" font-size="34">Aura</text><text x="450" y="172" font-size="36">Certificate of completion</text><text x="450" y="224" font-size="16">Frontend prototype · Demo certificate only</text><text x="450" y="306" font-size="32">${escape(worker.name)}</text><text x="450" y="366" font-size="19">${escape(certificate.title)}</text><text x="450" y="416" font-size="17">With ${escape(hirer.name)} · ${escape(dateLabel(certificate.issuedAt))}</text><text x="450" y="476" font-size="16">Simulated escrow released · No real payment</text><text x="450" y="530" font-size="22">${escape(certificate.code)}</text><text x="450" y="583" font-size="13">Genuine only within this demo dataset. Not cryptographically verified.</text><text x="450" y="630" font-size="12">${escape(link)}</text></g></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${certificate!.code}-demo.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    dispatch({
      type: "NOTICE",
      text: "Demo certificate downloaded as an SVG image.",
    });
  }
  return (
    <div className="certificate-page">
      {verify && (
        <div className="verification-heading">
          <Logo />
          <Banner tone="success">
            This certificate is genuine in the demo dataset.
          </Banner>
          <p className="small muted">
            This is a local record lookup, not cryptographic or external
            verification.
          </p>
        </div>
      )}
      <article className="certificate-card">
        <div className="certificate-inner">
          <BadgeCheck size={48} strokeWidth={1.2} className="brand" />
          <span className="eyebrow">A record of a good collaboration</span>
          <h1>
            Certificate
            <br />
            of completion
          </h1>
          <p>This demo recognises the contribution of</p>
          <h2>{worker.name}</h2>
          <p>for completing</p>
          <h3>{certificate.title}</h3>
          <div className="certificate-rule" />
          <dl>
            <div>
              <dt>Hirer</dt>
              <dd>
                {hirer.name} · {hirer.company}
              </dd>
            </div>
            <div>
              <dt>Issued</dt>
              <dd>{dateLabel(certificate.issuedAt)}</dd>
            </div>
            <div>
              <dt>Settlement</dt>
              <dd>{certificate.outcome}</dd>
            </div>
          </dl>
          <div className="certificate-bottom">
            <div>
              <strong>{certificate.code}</strong>
              <p>
                Demo certificate only.
                <br />
                No real payment or external verification.
              </p>
            </div>
            <QRCodeSVG
              value={link}
              size={96}
              title="QR code linking to this demo certificate verification route"
            />
          </div>
        </div>
      </article>
      <div className="actions centered-actions">
        <CopyLink value={link} />
        <Button onClick={download}>
          <Download size={16} />
          Download image
        </Button>
        {!verify && (
          <ButtonLink to={`/verify/${certificate.code}`}>
            Verify demo code <ArrowRight size={16} />
          </ButtonLink>
        )}
      </div>
      <p className="small muted centered">
        All names, work and proof outcomes are fictional. This record is for
        presentation only.
      </p>
      <Link className="text-link" to={`/gigs/${certificate.gigId}`}>
        Back to demo engagement <ArrowRight size={14} />
      </Link>
    </div>
  );
}
export function Account() {
  const { state, persona, dispatch } = useDemo();
  const navigate = useNavigate();
  const profile =
    workerService.get(state, persona.id) ||
    state.hirers.find((h) => h.id === persona.id)!;
  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState("city" in profile ? profile.city : "");
  const [reset, setReset] = useState(false);
  return (
    <>
      <PageTitle
        title="Your account"
        description="A few preferences for your time in the demo."
      />
      <div className="account-layout">
        <nav className="account-nav" aria-label="Account sections">
          {[
            { id: "profile", icon: User, text: "Profile" },
            { id: "verification", icon: ShieldCheck, text: "Verification" },
            { id: "payments", icon: CreditCard, text: "Payments" },
            { id: "notifications", icon: Bell, text: "Notifications" },
          ].map((item) => (
            <a
              href={`#/account#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "instant", block: "start" });
              }}
              key={item.id}
            >
              <item.icon size={18} />
              {item.text}
            </a>
          ))}
        </nav>
        <div className="stack">
          <Panel>
            <section id="profile">
              <div className="row">
                <Avatar id={persona.id} name={profile.name} size={64} />
                <div>
                  <h2>Profile</h2>
                  <p className="small muted">
                    {persona.role} ·{" "}
                    {state.accountTypes[persona.id] || persona.accountType} ·
                    fictional demo persona
                  </p>
                </div>
              </div>
              <form
                className="form-stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch({ type: "PROFILE", name, city });
                }}
              >
                <Field
                  label="Demo display name"
                  hint="Use a fictional name only."
                >
                  <input
                    value={name}
                    required
                    minLength={2}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                {"city" in profile && (
                  <Field label="Demo city">
                    <input
                      value={city}
                      required
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Field>
                )}
                <Button type="submit">Save demo profile</Button>
              </form>
            </section>
          </Panel>
          <Panel>
            <section id="verification">
              <h2>Verification</h2>
              <Banner>
                Seeded demo persona. No real identity or provider verification.
              </Banner>
              <p>
                {state.onboarding[persona.id]
                  ? "All four simulated onboarding checks have been completed this session."
                  : "You can explore the seeded persona or rehearse the onboarding checks."}
              </p>
              <ButtonLink to={`/onboarding/${persona.role}`}>
                Rehearse demo checks
              </ButtonLink>
            </section>
          </Panel>
          <Panel>
            <section id="payments">
              <h2>Payments</h2>
              <div className="setting-row">
                <div>
                  <strong>
                    {persona.role === "worker"
                      ? "Demo payout reference"
                      : "Demo payment reference"}
                  </strong>
                  <p>
                    DEMO-{persona.role === "worker" ? "PAYOUT" : "PAYMENT"}-001
                  </p>
                </div>
                <span className="badge warning">Simulated</span>
              </div>
              <p className="small muted">
                No card, UPI, bank details or real money are stored. All gig
                ledgers use an 8% fee on the released amount.
              </p>
              <ButtonLink to="/gigs">View demo ledgers</ButtonLink>
            </section>
          </Panel>
          <Panel>
            <section id="notifications">
              <h2>Notifications</h2>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={state.notifications[persona.id] ?? true}
                  onChange={(e) =>
                    dispatch({
                      type: "NOTIFICATIONS",
                      enabled: e.target.checked,
                    })
                  }
                />
                <span>Show demo notification preference as enabled</span>
              </label>
              <p className="small muted">
                This setting is local only. No email, SMS or push notification
                is sent.
              </p>
            </section>
          </Panel>
          <Panel>
            <h2>A fresh start</h2>
            <p>
              Restore every record to the initial scenario. All state is held in
              memory; refreshing the page also resets the demo.
            </p>
            <Button variant="danger" onClick={() => setReset(true)}>
              Reset this demo
            </Button>
          </Panel>
        </div>
      </div>
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
          This clears changes from this session and restores the seeded
          personas, gigs, claims and date.
        </Confirm>
      )}
    </>
  );
}
const features = [
  [
    "OTP",
    "Sample code 123456 checked locally.",
    "A secure delivery provider and server-side verification.",
  ],
  [
    "DigiLocker / identity",
    "A consent panel and a seeded outcome; no documents requested.",
    "A consented identity-provider flow with server-side validation.",
  ],
  [
    "Payments / escrow",
    "Local ledger, 8% fee and release/refund/split scenarios. No money moves.",
    "A regulated payment/escrow provider, compliance and reconciliation.",
  ],
  [
    "GST lookup",
    "DEMO-GST-OK and DEMO-REVIEW simulate two outcomes.",
    "An authorised business registry lookup and review process.",
  ],
  [
    "Account ownership",
    "A partial demo outcome. Ownership does not prove authorship.",
    "Provider authorisation plus separately assessed contribution evidence.",
  ],
  [
    "Client confirmation",
    "A seeded independent confirmation. No invitations sent.",
    "A consented, independently attributable confirmation workflow.",
  ],
  [
    "CV parsing",
    "Loads five fictional claims from bundled data; no file read.",
    "Consented document processing and reviewable extraction.",
  ],
  [
    "Aura Score / ratings",
    "Seeded score; +2 for a fully released, mutually rated gig. Ratings reveal after both respond or 3 demo days.",
    "A validated, fair scoring model and protected feedback process.",
  ],
  [
    "Certificate",
    "A local code lookup and a QR link into this dataset.",
    "A durable, auditable and independently verifiable issuance record.",
  ],
];
export function Help() {
  return (
    <div className="help-page">
      <PageTitle
        eyebrow="A little context goes a long way"
        title="Trust is something you can inspect."
        description="Aura connects a person’s claims to evidence, and a collaboration to a clear process."
      />
      <Banner tone="warning">
        Frontend presentation prototype. Every persona, proof outcome, provider
        check and payment is simulated.
      </Banner>
      <section id="verification">
        <h2>01 · A claim is a starting point.</h2>
        <p>
          A CV can tell a good story. The Claim Ring helps you ask better
          questions about it. Each arc is one claim, with an individual evidence
          status.
        </p>
        <dl className="help-definitions">
          <div>
            <dt>Verified</dt>
            <dd>A seeded strong-proof outcome. It is not real verification.</dd>
          </div>
          <div>
            <dt>Partially verified</dt>
            <dd>
              Some evidence is present; contribution, ownership or another
              important part remains unresolved.
            </dd>
          </div>
          <div>
            <dt>Self-declared</dt>
            <dd>
              The worker’s statement without adequate proof. Missing evidence
              does not mean fraud.
            </dd>
          </div>
          <div>
            <dt>Disproved</dt>
            <dd>
              An explicit, seeded contradiction. Never inferred from absent
              evidence.
            </dd>
          </div>
        </dl>
        <p>
          For creative work, separate <strong>artifact existence</strong>,{" "}
          <strong>contribution or authorship</strong>, and{" "}
          <strong>client relationship</strong>. A link and its metadata cannot
          establish all three.
        </p>
      </section>
      <section id="trials">
        <h2>02 · Start small. Decide with clarity.</h2>
        <p>
          A trial is a small, scoped, unpaid and watermarked sample. It should
          never become unpaid production work. Once accepted, a demo ledger
          makes the agreed amount, 8% fee and worker net visible.
        </p>
        <p>
          Delivery can be approved or disputed. The evaluator Review Desk can
          release, refund or split the gross amount 50/50. The fee is charged
          only on the portion released to the worker; a full refund carries no
          fee.
        </p>
      </section>
      <section id="ratings">
        <h2>03 · Let good work become a history.</h2>
        <p>
          Both parties rate three criteria. Extreme ratings need context.
          Feedback reveals when both sides respond or three simulated days after
          settlement. Use Evaluator tools to advance the clock.
        </p>
        <p>
          The Aura Score is an illustrative baseline with a simple +2 completion
          rule, capped at 100. This is not a validated reputation algorithm.
          Only fully released, mutually rated engagements receive a demo
          completion certificate.
        </p>
      </section>
      <section id="simulated">
        <h2>Nothing here is hidden.</h2>
        <p>
          Here is exactly what this prototype does and what a production version
          would need.
        </p>
        <div className="feature-table">
          <div className="feature-head">
            <span>Feature</span>
            <span>This prototype</span>
            <span>Production would use</span>
          </div>
          {features.map(([name, demo, production]) => (
            <div className="feature-row" key={name}>
              <strong>{name}</strong>
              <p>{demo}</p>
              <p>{production}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>A note for the presenter.</h2>
        <p>
          Use the separate dark Evaluator tools bar to switch personas, move
          time forward, resolve disputes and reset. The date starts at 18
          October 2026. Refreshing or resetting discards all session changes.
        </p>
        <ButtonLink to="/verify/AURA-2026-0001">
          Try a demo certificate <ArrowRight size={16} />
        </ButtonLink>
      </section>
      <p className="help-signoff">
        Nothing here is hidden: if it’s simulated, we say so.
      </p>
    </div>
  );
}
