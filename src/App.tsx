import { Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Shell } from "./components/Shell";
import { Empty } from "./components/ui";
import { Landing } from "./pages/Landing";
import { Interests, Onboarding } from "./pages/Onboarding";
import { Discovery, Shortlist } from "./pages/Discovery";
import { CV, WorkerProfilePage } from "./pages/Claims";
import { BidDetail, Bids, PostBrief } from "./pages/Marketplace";
import { Dashboard, Gigs } from "./pages/Dashboard";
import { GigWorkspace } from "./pages/GigWorkspace";
import { Account, CertificatePage, Help } from "./pages/Supporting";
import { useDemo } from "./state/DemoContext";
import type { ReactNode } from "react";
function RolePage({
  role,
  children,
}: {
  role: "hirer" | "worker";
  children: ReactNode;
}) {
  const { persona } = useDemo();
  if (persona.role !== role)
    return (
      <Empty
        title={`This is the ${role} workspace.`}
        to="/dashboard"
        action="Back to my dashboard"
      >
        Switch to a {role} persona in Evaluator tools to continue. This is a
        demo navigation guard, not a security control.
      </Empty>
    );
  return children;
}
export function App() {
  const { persona } = useDemo();
  const location = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Landing />} />
          <Route
            path="onboarding/:role"
            element={<Onboarding key={location.pathname} />}
          />
          <Route path="interests" element={<Interests key={persona.id} />} />
          <Route
            path="search"
            element={
              <RolePage role="hirer">
                <Discovery key={persona.id} />
              </RolePage>
            }
          />
          <Route
            path="shortlist"
            element={
              <RolePage role="hirer">
                <Shortlist />
              </RolePage>
            }
          />
          <Route
            path="briefs/new"
            element={
              <RolePage role="hirer">
                <PostBrief key={persona.id} />
              </RolePage>
            }
          />
          <Route
            path="workers/:id"
            element={<WorkerProfilePage key={location.pathname} />}
          />
          <Route path="dashboard" element={<Dashboard key={persona.id} />} />
          <Route
            path="cv"
            element={
              <RolePage role="worker">
                <CV key={persona.id} />
              </RolePage>
            }
          />
          <Route
            path="bids"
            element={
              <RolePage role="worker">
                <Bids key={persona.id} />
              </RolePage>
            }
          />
          <Route
            path="bids/:id"
            element={
              <RolePage role="worker">
                <BidDetail key={`${persona.id}-${location.pathname}`} />
              </RolePage>
            }
          />
          <Route path="gigs" element={<Gigs key={persona.id} />} />
          <Route
            path="gigs/:id"
            element={
              <GigWorkspace key={`${persona.id}-${location.pathname}`} />
            }
          />
          <Route path="certificates/:code" element={<CertificatePage />} />
          <Route path="verify/:code" element={<CertificatePage verify />} />
          <Route path="account" element={<Account key={persona.id} />} />
          <Route path="how-it-works" element={<Help />} />
          <Route
            path="*"
            element={
              <Empty
                title="A little off the beaten path."
                to="/"
                action="Back to Aura"
              >
                This page is not part of the demo. Let’s get you back to a good
                starting point.
              </Empty>
            }
          />
        </Route>
      </Routes>
    </MotionConfig>
  );
}
