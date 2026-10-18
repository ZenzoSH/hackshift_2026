import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { App } from "../App";
import { DemoProvider } from "../state/DemoContext";
import { createSeed } from "../data/seed";
import { ClaimRing, ProofBadge } from "./ui";
function app(path = "/", worker = false) {
  const seed = createSeed();
  if (worker) seed.personaId = "w1";
  return render(
    <MemoryRouter initialEntries={[path]}>
      <DemoProvider initialState={seed}>
        <App />
      </DemoProvider>
    </MemoryRouter>,
  );
}
describe("shared proof components", () => {
  it("names score and verified count accessibly at every size", () => {
    const s = createSeed();
    const claims = s.claims.filter((c) => c.workerId === "w1");
    for (const size of ["xs", "sm", "md", "lg"] as const) {
      const { unmount } = render(<ClaimRing claims={claims} size={size} />);
      expect(
        screen.getByRole("img", {
          name: "Demo Aura Score 76, Silver, 2 of 5 claims verified",
        }),
      ).toBeInTheDocument();
      unmount();
    }
  });
  it("labels every status and discloses simulation beyond color", () => {
    const statuses = [
      "Verified",
      "Partially verified",
      "Self-declared",
      "Disproved",
    ] as const;
    render(
      <>
        {statuses.map((s) => (
          <ProofBadge key={s} status={s} />
        ))}
      </>,
    );
    statuses.forEach((s) =>
      expect(screen.getByText(s)).toHaveAttribute(
        "title",
        expect.stringContaining("simulated"),
      ),
    );
  });
});
describe("routes and interactions", () => {
  it("connects landing role choice to onboarding", async () => {
    app();
    await userEvent.click(screen.getByRole("link", { name: /I want to hire/ }));
    expect(
      screen.getByRole("heading", { name: /Let’s make it official/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Continue to interests/ }),
    ).toBeDisabled();
  });
  it("gates CV publication and allows claim edits", async () => {
    app("/cv", true);
    expect(screen.getByRole("button", { name: /Go live/ })).toBeDisabled();
    await userEvent.click(
      screen.getByRole("checkbox", { name: /I sign this demo/ }),
    );
    await userEvent.click(screen.getByRole("button", { name: /Go live/ }));
    expect(
      screen.getByRole("button", { name: /Live in demo discovery/ }),
    ).toBeDisabled();
    await userEvent.click(
      screen.getByRole("button", { name: /Edit claim: Bachelor/ }),
    );
    const dialog = screen.getByRole("dialog");
    const field = within(dialog).getByRole("textbox", { name: /Claim text/ });
    await userEvent.clear(field);
    await userEvent.type(field, "A new and honest sample claim");
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Save claim" }),
    );
    expect(
      screen.getByRole("heading", { name: "A new and honest sample claim" }),
    ).toBeInTheDocument();
  });
  it("has valid and invalid certificate routes", () => {
    const first = app("/verify/AURA-2026-0001");
    expect(
      screen.getByText("This certificate is genuine in the demo dataset."),
    ).toBeInTheDocument();
    first.unmount();
    app("/verify/not-a-code");
    expect(
      screen.getByRole("heading", { name: "Certificate not found" }),
    ).toBeInTheDocument();
  });
  it("renders a useful route guard and not-found page", () => {
    const first = app("/cv");
    expect(
      screen.getByRole("heading", { name: "This is the worker workspace." }),
    ).toBeInTheDocument();
    first.unmount();
    app("/missing");
    expect(
      screen.getByRole("heading", { name: "A little off the beaten path." }),
    ).toBeInTheDocument();
  });
  it("keeps reset behind a clear confirmation", async () => {
    app("/dashboard");
    await userEvent.click(screen.getByRole("button", { name: "Reset demo" }));
    expect(
      screen.getByRole("dialog", { name: "Reset this demo?" }),
    ).toBeInTheDocument();
    await userEvent.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Cancel",
      }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("reads default demo data without external fetch calls", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    app("/workers/w1");
    expect(
      screen.getByRole("heading", { name: "Aanya Sharma" }),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    fetch.mockRestore();
  });
});
