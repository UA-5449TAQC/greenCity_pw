import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


test.describe('greenCity example', () => {

  test('should have a title', async ({ page }) => {
    // await page.goto('https://www.greencity.cx.ua/#/greenCity');
    await page.goto('/#/greenCity/');
    await expect(page).toHaveTitle(/GreenCity/);
  });

  test('check login modal', async ({ page }) => {
    // await page.goto('https://www.greencity.cx.ua/#/greenCity');
    await page.goto('/#/greenCity/');
    await page.getByAltText('sing in button').click();
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

});