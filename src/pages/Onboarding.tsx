import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Braces,
  Check,
  Clapperboard,
  CreditCard,
  DraftingCompass,
  Globe,
  Mail,
  Megaphone,
  Palette,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Banner, Button, Empty, Field, Modal, Panel } from "../components/ui";
import { useDemo } from "../state/DemoContext";
import { categories, type Category } from "../data/types";
import { verificationService } from "../data/services";
export const categoryIcons = [
  Sparkles,
  Globe,
  Clapperboard,
  Braces,
  DraftingCompass,
  Megaphone,
  Palette,
];
export function Onboarding() {
  const { role } = useParams();
  const { persona, dispatch } = useDemo();
  const navigate = useNavigate();
  const [type, setType] = useState<"Individual" | "Studio">("Individual");
  const [checks, setChecks] = useState<string[]>([]);
  const [modal, setModal] = useState<string>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [gst, setGst] = useState("DEMO-GST-OK");
  const [business, setBusiness] = useState("Kanso Demo Studio");
  const [signatory, setSignatory] = useState("Demo signatory");
  const [businessEmail, setBusinessEmail] = useState("studio@example.test");
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (role === "worker" || role === "hirer") {
      if (persona.role !== role)
        dispatch({ type: "SWITCH", id: role === "worker" ? "w1" : "h1" });
    }
  }, [role, persona.role, dispatch]);
  if (role !== "worker" && role !== "hirer")
    return (
      <Empty title="Choose a demo role" to="/" action="Back to role selection">
        Aura has a worker experience and a hirer experience.
      </Empty>
    );
  const review = type === "Studio" && verificationService.gst(gst) === "review";
  const businessValid =
    type !== "Studio" ||
    (verificationService.gst(gst) === "passed" &&
      business.trim().length >= 2 &&
      signatory.trim().length >= 2 &&
      /^[^@]+@[^@]+\.test$/.test(businessEmail));
  const steps = [
    { id: "Mobile", icon: Smartphone, value: "DEMO-MOBILE-001" },
    { id: "Email", icon: Mail, value: "hello@example.test" },
    { id: "Identity", icon: ShieldCheck, value: "Demo DigiLocker consent" },
    {
      id: "Payment",
      icon: CreditCard,
      value: role === "worker" ? "DEMO-PAYOUT-001" : "DEMO-PAYMENT-001",
    },
  ];
  function complete(id: string) {
    setChecks((prev) => [...new Set([...prev, id])]);
    setModal(undefined);
    setError("");
  }
  return (
    <div className="onboarding">
      <div className="onboarding-title">
        <span className="eyebrow">A good beginning · Step 1 of 2</span>
        <h1>
          Let’s make it official.
          <br />
          <span className="muted">In the demo, of course.</span>
        </h1>
        <p>
          A little trust goes a long way. Set up your {role} profile with sample
          details.
        </p>
      </div>
      <div className="onboarding-grid">
        <div className="stack">
          <Banner tone="warning">
            Demo only. Use sample values; never enter real contact, identity or
            payment details.
          </Banner>
          <div className="segmented" aria-label="Account type">
            {(["Individual", "Studio"] as const).map((t) => (
              <Button
                key={t}
                aria-pressed={type === t}
                onClick={() => setType(t)}
              >
                {t}
              </Button>
            ))}
          </div>
          {type === "Studio" && (
            <Panel>
              <div className="form-stack">
                <Field label="Demo business name">
                  <input
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    required
                  />
                </Field>
                <Field
                  label="Demo GSTIN"
                  hint="Use DEMO-GST-OK to pass or DEMO-REVIEW to show account review."
                >
                  <input
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    required
                  />
                </Field>
                <Field
                  label="Business email"
                  hint="Use a fictional .test address."
                >
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                  />
                </Field>
                <Field label="Authorised signatory (demo alias)">
                  <input
                    value={signatory}
                    onChange={(e) => setSignatory(e.target.value)}
                  />
                </Field>
              </div>
              {!businessValid && !review && (
                <p className="error">
                  Complete the demo fields with a .test email and DEMO-GST-OK.
                </p>
              )}
            </Panel>
          )}
          <Panel className="checklist">
            {steps.map((step) => (
              <div className="checklist-row" key={step.id}>
                <span className="check-icon">
                  <step.icon size={19} />
                </span>
                <div className="grow">
                  <strong>
                    {step.id === "Payment" && role === "worker"
                      ? "Payout method"
                      : step.id}
                  </strong>
                  <small>{step.value}</small>
                </div>
                <Button
                  onClick={() => {
                    setModal(step.id);
                    setError("");
                    setOtp(["", "", "", "", "", ""]);
                  }}
                >
                  {checks.includes(step.id) ? (
                    <>
                      <Check size={15} />
                      Demo checked
                    </>
                  ) : (
                    "Simulate check"
                  )}
                </Button>
              </div>
            ))}
          </Panel>
          {review && (
            <Banner tone="danger">
              <strong>Account under review.</strong> DEMO-REVIEW deliberately
              triggers a sample business-record mismatch. Continuation is
              blocked. Use DEMO-GST-OK to rehearse a successful check.
            </Banner>
          )}
          <Button
            variant="primary"
            disabled={checks.length < 4 || !businessValid || review}
            onClick={() => {
              dispatch({ type: "ONBOARD", accountType: type });
              navigate("/interests");
            }}
          >
            Continue to interests <ArrowRight size={17} />
          </Button>
          {checks.length < 4 && (
            <p className="small muted">
              Complete all four demo checks to continue.
            </p>
          )}
        </div>
        <aside className="onboarding-aside">
          <BadgeCheck size={32} />
          <h2>A clearer starting point.</h2>
          <p>
            These checks introduce the trust model. They do not verify a real
            person or contact an external service.
          </p>
          <ul>
            <li>Contact checks show a reachable-account concept.</li>
            <li>Identity is separate from skill and authorship.</li>
            <li>Payment details are fictional references only.</li>
          </ul>
          <div className="aside-note">
            No documents.
            <br />
            No real payments.
            <br />
            Just a transparent walkthrough.
          </div>
        </aside>
      </div>
      {modal && (
        <Modal
          title={`Simulate ${modal.toLowerCase()} check`}
          onClose={() => setModal(undefined)}
        >
          <Banner tone="warning">
            Demo interaction. No provider is contacted and no information is
            sent.
          </Banner>
          {modal === "Mobile" || modal === "Email" ? (
            <>
              <p>
                Enter the sample code. Nothing was sent to a phone or inbox.
              </p>
              <p>
                <strong>Demo code: 123456</strong>
              </p>
              <div className="otp-boxes">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    aria-label={`Code digit ${i + 1}`}
                    autoFocus={i === 0}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onPaste={(e) => {
                      e.preventDefault();
                      const code = e.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtp(
                        Array.from({ length: 6 }, (_, j) => code[j] || ""),
                      );
                      refs.current[Math.min(code.length, 5)]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && i > 0)
                        refs.current[i - 1]?.focus();
                    }}
                    onChange={(e) => {
                      const next = e.target.value.replace(/\D/g, "").slice(-1);
                      setOtp((prev) =>
                        prev.map((v, j) => (j === i ? next : v)),
                      );
                      if (next && i < 5) refs.current[i + 1]?.focus();
                    }}
                  />
                ))}
              </div>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <Button
                variant="primary"
                onClick={() =>
                  verificationService.otp(otp.join(""))
                    ? complete(modal)
                    : setError(
                        "That code does not match. Use demo code 123456.",
                      )
                }
              >
                Check demo code
              </Button>
            </>
          ) : (
            <>
              <p>
                {modal === "Identity"
                  ? "Simulate a DigiLocker consent result using DEMO-ID-001. This is an illustrative identity outcome, not an assessment of skill or authorship."
                  : "Use the prefilled fictional payment reference. No card, UPI ID or bank information is required."}
              </p>
              <Button variant="primary" onClick={() => complete(modal)}>
                {modal === "Identity"
                  ? "Allow simulated consent"
                  : "Use demo payment reference"}
              </Button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
export function Interests() {
  const { persona, dispatch, state } = useDemo();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Category[]>(
    state.workers.find((w) => w.id === persona.id)?.interests || [],
  );
  return (
    <div className="interests-page">
      <span className="eyebrow">Find your corner · Step 2 of 2</span>
      <h1>
        {persona.role === "worker"
          ? "What do you love working on?"
          : "What are you looking to create?"}
      </h1>
      <p>
        Pick the work that interests you. A great collaboration starts with
        common ground.
      </p>
      <div className="interest-grid">
        {categories.map((c, i) => {
          const Icon = categoryIcons[i];
          return (
            <button
              className={`interest-tile ${selected.includes(c) ? "selected" : ""}`}
              key={c}
              aria-pressed={selected.includes(c)}
              onClick={() =>
                setSelected((prev) =>
                  prev.includes(c) ? prev.filter((v) => v !== c) : [...prev, c],
                )
              }
            >
              <Icon size={28} />
              <strong>{c}</strong>
              {selected.includes(c) && <Check size={17} />}
            </button>
          );
        })}
      </div>
      <Button
        variant="primary"
        disabled={!selected.length}
        onClick={() => {
          dispatch({ type: "INTERESTS", interests: selected });
          navigate(
            persona.role === "worker"
              ? "/cv"
              : `/search?category=${encodeURIComponent(selected[0])}`,
          );
        }}
      >
        {persona.role === "worker" ? "Build my demo CV" : "Discover the people"}
        <ArrowRight size={17} />
      </Button>
      <p className="small muted">
        {selected.length
          ? `${selected.length} ${selected.length === 1 ? "interest" : "interests"} selected`
          : "Choose at least one category to continue."}
      </p>
    </div>
  );
}
