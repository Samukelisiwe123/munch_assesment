import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';
import { SortPage } from '../page-objects/sort-page';

test.describe.serial('Munch QA Tech Assessment Tests', () => {
  let loginPage: LoginPage;
  let sortPage: SortPage;
  let sharedPage: any;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();
    loginPage = new LoginPage(sharedPage);
    sortPage = new SortPage(sharedPage);
  });

  test.afterAll(async () => {
    await sharedPage.context().close();
  });

  test('should login successfully', async () => {
    await loginPage.login();

  });

  test('should sort products by price low to high', async () => {
    // Assuming the user is already logged in from the previous test
    await sortPage.sortByPriceLowToHigh();
  });
});
































// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
