import { test, expect, type Page } from "@playwright/test";
async function route(page: Page, path: string) {
  await page.evaluate((p) => {
    window.location.hash = p;
  }, path);
  await expect(page).toHaveURL(
    new RegExp(`#${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
  );
  await expect(page.locator("main")).toHaveAttribute("data-route", path);
}
async function persona(page: Page, id: string) {
  const pill = page.getByRole("button", {
    name: "Evaluator tools",
    exact: true,
  });
  if (await pill.isVisible()) await pill.click();
  await page.getByRole("combobox", { name: "Demo persona" }).selectOption(id);
  await expect(page).toHaveURL(/#\/dashboard$/);
}
async function evaluator(page: Page) {
  const pill = page.getByRole("button", {
    name: "Evaluator tools",
    exact: true,
  });
  if (await pill.isVisible()) await pill.click();
}
async function confirm(page: Page, label: string) {
  await page
    .getByRole("dialog")
    .getByRole("button", { name: label, exact: true })
    .click();
}
async function rate(page: Page, labels: string[]) {
  for (const label of labels)
    await page
      .getByRole("radio", { name: `${label}: 4 stars`, exact: true })
      .check();
  await page.getByRole("button", { name: "Save demo rating" }).click();
}
test("landing, onboarding, discovery, brief, bid and complete gig journey", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("link", { name: /I want to hire/ }).click();
  for (const name of ["Mobile", "Email"]) {
    await page
      .locator(".checklist-row")
      .filter({ hasText: name })
      .getByRole("button")
      .click();
    for (let i = 0; i < 6; i++)
      await page
        .getByRole("textbox", { name: `Code digit ${i + 1}` })
        .fill(String(i + 1));
    await page.getByRole("button", { name: "Check demo code" }).click();
  }
  await page
    .locator(".checklist-row")
    .filter({ hasText: "Identity" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Allow simulated consent" }).click();
  await page
    .locator(".checklist-row")
    .filter({ hasText: "Payment" })
    .getByRole("button")
    .click();
  await page
    .getByRole("button", { name: "Use demo payment reference" })
    .click();
  await page.getByRole("button", { name: "Continue to interests" }).click();
  await page
    .getByRole("button", { name: "Web Development", exact: true })
    .click();
  await page.getByRole("button", { name: "Discover the people" }).click();
  await expect(
    page.getByRole("heading", { name: "Kabir Mehta", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Shortlist worker", exact: true })
    .click();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Kabir Mehta", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "List", exact: true }).click();
  await page
    .getByRole("button", { name: "Compare", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Deck", exact: true }).click();
  await route(page, "/briefs/new");
  await page
    .getByRole("textbox", { name: "Give your brief a title" })
    .fill("A studio homepage with room to grow");
  await page
    .getByRole("textbox", { name: "What should be delivered?" })
    .fill("A responsive homepage concept with desktop and mobile layouts.");
  await page
    .getByRole("textbox", { name: "One small trial task" })
    .fill(
      "One low fidelity hero sketch, 15 minutes maximum, no production work.",
    );
  await page.getByRole("button", { name: /Post brief and invite/ }).click();
  const gigPath = new URL(page.url()).hash.slice(1);
  await expect(
    page.getByRole("heading", { name: "A studio homepage with room to grow" }),
  ).toBeVisible();
  await persona(page, "w2");
  await route(page, "/bids");
  await page
    .getByRole("link", {
      name: "A studio homepage with room to grow",
      exact: true,
    })
    .click();
  await page
    .getByRole("textbox", { name: "How would you approach this?" })
    .fill(
      "I will start with the core user journey, sketch a structure, then refine the responsive layout.",
    );
  await page.getByRole("button", { name: "Send demo proposal" }).click();
  await expect(
    page.getByRole("heading", { name: "Your proposal is in." }),
  ).toBeVisible();
  await persona(page, "h1");
  await route(page, gigPath);
  await page
    .getByRole("button", { name: "Request trial", exact: true })
    .click();
  await confirm(page, "Request trial");
  await persona(page, "w2");
  await route(page, gigPath);
  await page.getByRole("button", { name: "Attach demo asset" }).click();
  await page
    .getByRole("textbox", { name: "Sample notes" })
    .fill("A small watermarked hero concept for the sample brief.");
  await page.getByRole("button", { name: "Send watermarked sample" }).click();
  await persona(page, "h1");
  await route(page, gigPath);
  await page.getByRole("button", { name: "Accept trial", exact: true }).click();
  await confirm(page, "Accept trial");
  await page.getByRole("button", { name: /Fund escrow ·/ }).click();
  await confirm(page, "Fund demo escrow");
  await persona(page, "w2");
  await route(page, gigPath);
  await page.getByRole("button", { name: "Attach demo asset" }).click();
  await page
    .getByRole("textbox", { name: "Delivery notes" })
    .fill("The final desktop and mobile concept is ready for review.");
  await page.getByRole("button", { name: "Deliver demo work" }).click();
  await persona(page, "h1");
  await route(page, gigPath);
  await page
    .getByRole("button", { name: "Approve and release", exact: true })
    .click();
  await confirm(page, "Approve and release");
  await rate(page, ["Quality", "Timeliness", "Communication"]);
  await persona(page, "w2");
  await route(page, gigPath);
  await rate(page, ["Clarity", "Prompt payment", "Communication"]);
  await page.getByRole("link", { name: "View certificate" }).click();
  await expect(
    page.getByRole("heading", { name: "Certificate of completion" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Verify demo code" }).click();
  await expect(
    page.getByText("This certificate is genuine in the demo dataset."),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("CV edits, proof semantics, declaration gate and sample parser", async ({
  page,
}) => {
  await page.goto("/");
  await persona(page, "w1");
  await route(page, "/cv");
  await expect(
    page.getByRole("button", { name: /Go live in discovery/ }),
  ).toBeDisabled();
  await page.getByRole("checkbox", { name: /I sign this demo/ }).check();
  await page.getByRole("button", { name: /Go live in discovery/ }).click();
  await expect(
    page.getByRole("button", { name: /Live in demo discovery/ }),
  ).toBeDisabled();
  await page.getByRole("button", { name: /Edit claim: Bachelor/ }).click();
  await page
    .getByRole("textbox", { name: "Claim text" })
    .fill("A new sample degree claim for this demo");
  await confirm(page, "Save claim");
  const claim = page
    .locator(".claim-row")
    .filter({ hasText: "A new sample degree claim" });
  await expect(claim.getByText("Self-declared", { exact: true })).toBeVisible();
  await claim.getByRole("button", { name: "Add proof link" }).click();
  await page
    .getByRole("textbox", { name: "Sample proof URL" })
    .fill("https://example.test/demo-proof");
  await confirm(page, "Attach demo proof link");
  await expect(
    claim.getByText("Partially verified", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Load sample CV (.docx)" }).click();
  await confirm(page, "Load sample CV");
  await expect(
    page.getByRole("heading", { name: "Bachelor of Design · Class of 2023" }),
  ).toBeVisible();
});
test("trial rejection and review desk split resolution", async ({ page }) => {
  await page.goto("/#/gigs/g2");
  await page.getByRole("button", { name: "Reject with a reason" }).click();
  await page
    .getByRole("combobox", { name: "Rejection reason" })
    .selectOption("Off-brief");
  await confirm(page, "Reject trial");
  await expect(
    page.getByText("Previous trial rejected: Off-brief.", { exact: false }),
  ).toBeVisible();
  await evaluator(page);
  await page.getByRole("button", { name: /Review Desk/ }).click();
  await page.getByRole("button", { name: "Split 50/50" }).click();
  await page
    .getByRole("dialog", { name: "Apply simulated decision?" })
    .getByRole("button", { name: "Confirm split" })
    .click();
  await expect(page.getByText("No unresolved disputes remain.")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close dialog" })
    .click();
  await route(page, "/gigs/g4");
  await expect(page.getByText("₹4,600").first()).toBeVisible();
  await expect(page.getByText("₹5,000").first()).toBeVisible();
});
test("date advancement, account preference and confirmed reset", async ({
  page,
}) => {
  await page.goto("/#/account");
  await page
    .getByRole("checkbox", {
      name: "Show demo notification preference as enabled",
    })
    .uncheck();
  await evaluator(page);
  await page.getByRole("button", { name: "+5 days", exact: true }).click();
  await expect(page.locator(".demo-date:visible")).toHaveText("23 Oct 2026");
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Reset demo", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: /Hire people whose work/ }),
  ).toBeVisible();
  await route(page, "/account");
  await expect(
    page.getByRole("checkbox", {
      name: "Show demo notification preference as enabled",
    }),
  ).toBeChecked();
});
test("studio review blocks progress and invalid OTP has useful feedback", async ({
  page,
}) => {
  await page.goto("/#/onboarding/hirer");
  await page.getByRole("button", { name: "Studio", exact: true }).click();
  await page.getByRole("textbox", { name: "Demo GSTIN" }).fill("DEMO-REVIEW");
  await expect(
    page.getByText("Account under review.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Continue to interests/ }),
  ).toBeDisabled();
  await page
    .locator(".checklist-row")
    .filter({ hasText: "Mobile" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Check demo code" }).click();
  await expect(
    page.getByText("That code does not match. Use demo code 123456."),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("certificate image download and unknown code", async ({ page }) => {
  await page.goto("/#/verify/AURA-2026-0001");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download image" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("AURA-2026-0001-demo.svg");
  await route(page, "/verify/unknown");
  await expect(
    page.getByRole("heading", { name: "Certificate not found" }),
  ).toBeVisible();
});
test("all routes render without horizontal overflow at 320px and have useful headings", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  for (const path of [
    "/",
    "/search",
    "/shortlist",
    "/briefs/new",
    "/workers/w1",
    "/dashboard",
    "/gigs",
    "/gigs/g1",
    "/gigs/g2",
    "/gigs/g3",
    "/gigs/g4",
    "/gigs/g5",
    "/account",
    "/how-it-works",
    "/verify/AURA-2026-0001",
    "/missing",
  ]) {
    await route(page, path);
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow, `overflow on ${path}`).toBe(false);
  }
  await persona(page, "w1");
  for (const path of ["/dashboard", "/cv", "/bids", "/bids/b1"]) {
    await route(page, path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      ),
      `overflow on ${path}`,
    ).toBe(false);
  }
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-mobile-cv.png`,
    fullPage: true,
  });
});
test("keyboard deck controls, modal focus and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/search");
  const deck = page.locator(".deck");
  await deck.focus();
  const before = await deck.locator("h2").innerText();
  await page.keyboard.press("ArrowLeft");
  await expect(deck.locator("h2")).not.toHaveText(before);
  await deck.focus();
  await page.keyboard.press("z");
  await expect(deck.locator("h2")).toHaveText(before);
  await evaluator(page);
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Reset this demo?" });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  expect(
    await page.evaluate(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);
});
test("desktop and mobile presentation snapshots", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.locator(".product-collage")).toHaveCSS("opacity", "1");
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-landing.png`,
    fullPage: true,
  });
  await route(page, "/search");
  await expect(page.locator(".deck > div").last()).toHaveCSS("opacity", "1");
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-discovery.png`,
    fullPage: true,
  });
});
test("comparison selection is capped at three and supports filtered workers", async ({
  page,
}) => {
  await page.goto("/#/search");
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Kabir Mehta", exact: true })
    .check();
  await page.getByRole("checkbox", { name: "Meera Iyer", exact: true }).check();
  await page.getByRole("checkbox", { name: "Rohan Das", exact: true }).check();
  await expect(
    page.getByRole("checkbox", { name: "Ishaan Rao", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".compare-grid .panel")).toHaveCount(3);
  await page
    .getByRole("checkbox", { name: "Rohan Das", exact: true })
    .uncheck();
  await expect(
    page.getByRole("checkbox", { name: "Ishaan Rao", exact: true }),
  ).toBeEnabled();
});
test("no external requests and WCAG accessibility scan on primary routes", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  const external: string[] = [];
  page.on("request", (request) => {
    if (
      /^https?:/.test(request.url()) &&
      !request.url().startsWith("http://127.0.0.1:5186/")
    )
      external.push(request.url());
  });
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    "/",
    "/search",
    "/dashboard",
    "/workers/w1",
    "/briefs/new",
    "/gigs/g2",
    "/gigs/g3",
    "/gigs/g4",
    "/gigs/g5",
    "/account",
    "/how-it-works",
    "/verify/AURA-2026-0001",
  ]) {
    await route(page, path);
    if (path === "/")
      await expect(page.locator(".product-collage")).toHaveCSS("opacity", "1");
    if (path === "/search")
      await expect(page.locator(".deck > div").last()).toHaveCSS(
        "opacity",
        "1",
      );
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations,
      `Accessibility violations on ${path}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
  await persona(page, "w1");
  for (const path of ["/dashboard", "/cv", "/bids", "/bids/b1"]) {
    await route(page, path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations,
      `Accessibility violations on worker ${path}`,
    ).toEqual([]);
  }
  expect(external).toEqual([]);
});
