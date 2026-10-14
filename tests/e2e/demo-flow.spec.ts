import { expect, test } from "@playwright/test";

test("book, check in, POS, check out", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/demo?hotel=aurelia");
  await expect(page.getByText(/Rooms booked tonight/i)).toBeVisible();

  await page.getByRole("gridcell").first().click();
  await expect(page.getByRole("heading", { name: "New booking" })).toBeVisible();
  await page.getByLabel("Guest name").fill("E2E Guest");
  await page.getByRole("button", { name: "Confirm booking" }).click();
  await expect(page.getByRole("heading", { name: "E2E Guest" })).toBeVisible();

  await page.getByRole("tab", { name: "Front desk" }).click();
  await page.getByRole("button", { name: "Check in" }).first().click();

  await page.getByRole("tab", { name: "Restaurant" }).click();
  await page.getByRole("button", { name: /Indori poha/i }).click();
  await page.getByRole("button", { name: "Send to kitchen" }).click();

  await page.getByRole("tab", { name: "Front desk" }).click();
  await page.getByRole("button", { name: "Check out" }).first().click();

  await page.getByRole("tab", { name: "Housekeeping" }).click();
  await expect(page.getByText(/Needs cleaning/i).first()).toBeVisible();
});
