import { expect, test } from "@playwright/test";

test("public homepage renders hero, listings and footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /El Marketplace Náutico de Referencia/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Embarcaciones destacadas" })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  await page.screenshot({ path: "test-results/home.png", fullPage: true });
});

test("search filters the listing grid", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Buscar astillero o modelo").fill("riva");
  await expect(page.getByRole("heading", { name: /Riva Rivale/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Beneteau/ })).toHaveCount(0);
});

test("length and propulsion filters narrow the grid", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Filtros/ }).click();
  await page.getByLabel("Propulsión").selectOption("Vela");
  await page.getByLabel("Eslora").selectOption("12-18");
  await expect(page.getByRole("heading", { name: /Beneteau Oceanis/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Sea Ray/ })).toHaveCount(0);
});

test("navbar section pages are reachable", async ({ page }) => {
  for (const [href, title] of [
    ["/motores", "Motores y Repuestos"],
    ["/servicios", "Servicios Náuticos y Brokers"],
    ["/guia", "Guía y Trámites"],
    ["/eventos", "Eventos"],
  ]) {
    await page.goto(href);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  }
});

test("publish form is open without an account", async ({ page }) => {
  await page.goto("/publicar");
  await expect(page.getByRole("heading", { name: "Publicá tu embarcación" })).toBeVisible();
  await expect(page.getByLabel("Astillero")).toBeVisible();
  await expect(page.getByRole("button", { name: "Enviar aviso a revisión" })).toBeVisible();
});

test("login page is reachable from the navbar", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Ingresar" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Bienvenido de nuevo" })).toBeVisible();
});

test("dashboard redirects unauthenticated visitors to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});

test("footer theme switch toggles light/dark and persists", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await page.getByRole("radio", { name: "Claro" }).click();
  await expect(html).not.toHaveClass(/dark/);
  await page.reload();
  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole("radio", { name: "Oscuro" }).click();
  await expect(html).toHaveClass(/dark/);
});
