import { test, expect, Page, Locator } from '@playwright/test';
import { assert } from 'node:console';
import * as allure from 'allure-js-commons';

test.describe('GreenCity Events page - Guest user', () => {
  const baseURL = 'https://www.greencity.cx.ua';
  const homeURL = `${baseURL}/#/greenCity`;
  const eventsURL = `${baseURL}/#/greenCity/events`;
  const invalidSearchValue = '!@#NoEvent123';

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.setViewportSize({ width: 1690, height: 1050 });
  });

  test('Validate correct rendering, data integrity, and stability of events list for guest users', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await allure.epic('GreenCity');
    await allure.feature('Events');
    await allure.story('Guest user can view and interact with events list');
    await allure.severity('critical');
    await allure.owner('QA');
    await allure.tag('UI');
    await allure.tag('Guest');
    await allure.tag('Events');
    await allure.tag('Regression');

    await test.step('Step 1. Navigate to homepage', async () => {
      await page.goto(homeURL, { waitUntil: 'networkidle' });
      await expect(page).toHaveURL(/#\/greenCity$/);
      await attachScreenshot(page, 'Step 1 - Homepage loaded');
    });

    await test.step('Step 2. Click "Events" in header', async () => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const eventsNavLink = page.locator('a.url-name[href="#/greenCity/events"]').first();
    await expect(eventsNavLink).toBeVisible();
    await expect(eventsNavLink).toHaveText(/Events/i);
    await eventsNavLink.click();
});

    await test.step('Step 3. Validate page URL', async () => {
      await expect(page).toHaveURL(/#\/greenCity\/events$/);
      await allure.attachment('Current URL', await page.url(), 'text/plain');
    });

    await test.step('Step 4. Verify page title', async () => {
      const header = page.locator('.main-header');
      await expect(header).toBeVisible();
      await expect(header).toContainText('Events');
    });

    await test.step('Step 5. Verify event cards rendering', async () => {
      const cards = page.locator('.card-wrapper');
      await expect(cards.first()).toBeVisible({ timeout: 15000 });
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      await allure.attachment('Visible event cards count', String(count), 'text/plain');

      for (let i = 0; i < Math.min(count, 6); i++) {
        await expect(cards.nth(i)).toBeVisible();
      }

      await expectNoCardOverlap(cards);
      await expectRoughlyEqualHeights(cards);

      await attachScreenshot(page, 'Step 5 - Event cards rendered');
    });

    await test.step('Step 6. Verify no UI breaks in cards area', async () => {
  const cards = page.locator('.card-wrapper');
  const count = await cards.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < Math.min(count, 6); i++) {
    const card = cards.nth(i);

    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();

    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThan(50);
    expect(box!.width).toBeGreaterThan(0);
  }
});

    await test.step('Step 7. Verify page title remains visible', async () => {
      const header = page.locator('.main-header');
      await expect(header).toBeVisible();
      await expect(header).toContainText('Events');
    });

    await test.step('Step 8. Verify event cards still render correctly', async () => {
      const cards = await getEventCards(page);
      const count = await cards.count();

      expect(count).toBeGreaterThan(0);
      await expect(cards.first()).toBeVisible();
    });

    await test.step('Step 9. Verify fallback image', async () => {
      const cards = await getEventCards(page);
      const images = cards.locator('img');
      const imageCount = await images.count();

      await allure.attachment('Images found in cards', String(imageCount), 'text/plain');

      if (imageCount > 0) {
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          await expect(images.nth(i)).toBeVisible();
        }
      }
    });

    await test.step('Step 10. Verify title handling for long title', async () => {
      const cards = await getEventCards(page);
      const titles = cards.locator('h1, h2, h3, h4, p, span');

      const titleCount = await titles.count();
      let checkedLongTitle = false;

      for (let i = 0; i < Math.min(titleCount, 15); i++) {
        const title = titles.nth(i);
        const text = (await title.textContent())?.trim() ?? '';

        if (text.length > 40) {
          const styles = await title.evaluate((el) => {
            const s = window.getComputedStyle(el);
            return {
              textOverflow: s.textOverflow,
              overflow: s.overflow,
              whiteSpace: s.whiteSpace,
              scrollWidth: (el as HTMLElement).scrollWidth,
              clientWidth: (el as HTMLElement).clientWidth,
            };
          });

          expect(
            styles.textOverflow === 'ellipsis' ||
              styles.scrollWidth > styles.clientWidth ||
              styles.whiteSpace === 'nowrap'
          ).toBeTruthy();

          checkedLongTitle = true;
          await allure.attachment(
            'Long title validation',
            JSON.stringify({ text, styles }, null, 2),
            'application/json'
          );
          break;
        }
      }

      if (!checkedLongTitle) {
        await allure.attachment(
          'Long title validation',
          'No long title found in current dataset.',
          'text/plain'
        );
      }
    });

    await test.step('Step 11. Validate date/time format', async () => {
      const bodyText = await page.locator('body').innerText();

      expect(
        /(\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b)|(\b\d{1,2}:\d{2}\b)|(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b)/i.test(
          bodyText
        )
      ).toBeTruthy();
    });
/* Location in card doesn't have a specific format */
    /* await test.step('Step 12. Validate location display', async () => {
      const bodyText = await page.locator('body').innerText();
      expect(/online|offline/i.test(bodyText)).toBeTruthy();
    }); */

    await test.step('Step 13. Verify organizer info', async () => {
  const cards = page.locator('.card-wrapper');
  const count = await cards.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < Math.min(count, 6); i++) {
    const card = cards.nth(i);
    const authorBlock = card.locator('.author');

    await expect(authorBlock).toBeVisible();

    const authorImage = authorBlock.locator('img[alt="author"]');
    const authorName = authorBlock.locator('p');

    await expect(authorImage).toBeVisible();
    await expect(authorName).toBeVisible();
  }
});

    await test.step('Step 14. Verify Join button', async () => {
      const joinButtons = page
        .locator('a, button, [role="button"], [role="link"]')
        .filter({ hasText: /join/i });

      const count = await joinButtons.count();
      await allure.attachment('Join buttons found', String(count), 'text/plain');

      if (count > 0) {
        await expect(joinButtons.first()).toBeVisible();
      }
    });

    await test.step('Step 15. Scroll page', async () => {
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(500);
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(500);

      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);

      await attachScreenshot(page, 'Step 15 - Scrolled page');
    });

   await test.step('Step 16. Trigger lazy loading', async () => {
  const cards = page.locator('.card-wrapper');
  const initialCount = await cards.count();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await expect
    .poll(async () => await cards.count(), { timeout: 5000 })
    .toBeGreaterThanOrEqual(initialCount);

  const afterCount = await cards.count();
  expect(afterCount).toBeGreaterThanOrEqual(initialCount);
});

    await test.step('Step 17. Switch view (Grid/List)', async () => {
  const gridButton = page.locator('button[aria-label="table view"]');
  const listButton = page.locator('button[aria-label="list view"]');

  // Ensure both buttons exist
  await expect(gridButton).toBeVisible();
  await expect(listButton).toBeVisible();

  // Check initial state (grid is active by default)
  await expect(gridButton).toHaveAttribute('aria-pressed', 'true');
  await expect(listButton).toHaveAttribute('aria-pressed', 'false');

  // Switch to list view
  await listButton.click();

  // Validate state changed
  await expect(listButton).toHaveAttribute('aria-pressed', 'true');
  await expect(gridButton).toHaveAttribute('aria-pressed', 'false');


  // Switch back to grid view
  await gridButton.click();

  await expect(gridButton).toHaveAttribute('aria-pressed', 'true');
  await expect(listButton).toHaveAttribute('aria-pressed', 'false');

  await allure.attachment(
    'View switch result',
    'Successfully toggled between grid and list view',
    'text/plain'
  );
});


    await test.step('Step 18. Enter invalid search', async () => {
      const searchInput = page
        .locator('input[type="search"], input[placeholder*="search" i], input[name*="search" i]')
        .first();

      if ((await searchInput.count()) > 0) {
        await expect(searchInput).toBeVisible();
        await searchInput.fill(invalidSearchValue);
        await searchInput.press('Enter');
        await page.waitForTimeout(1000);

        const bodyText = await page.locator('body').innerText();
        expect(/no events|no results|nothing found|empty/i.test(bodyText)).toBeTruthy();

        await attachScreenshot(page, 'Step 18 - Invalid search result');
      } else {
        await allure.attachment(
          'Search input',
          'Search input was not found on the page.',
          'text/plain'
        );
      }
    });

    await test.step('Step 19. Clear search', async () => {
      const searchInput = page
        .locator('input[type="search"], input[placeholder*="search" i], input[name*="search" i]')
        .first();

      if ((await searchInput.count()) > 0) {
        await searchInput.fill('');
        await searchInput.press('Enter');
        await page.waitForTimeout(1000);

        const cards = await getEventCards(page);
        expect(await cards.count()).toBeGreaterThan(0);
      }
    });

    await test.step('Step 20. Refresh page and verify stability', async () => {
      await page.reload({ waitUntil: 'networkidle' });
      await expect(page).toHaveURL(/#\/greenCity\/events$/);

      const header = page.locator('.main-header');
      await expect(header).toBeVisible();
      await expect(header).toContainText('Events');

      await allure.attachment(
        'Console errors after refresh',
        consoleErrors.length ? consoleErrors.join('\n') : 'No console errors detected',
        'text/plain'
      );

      expect(consoleErrors).toEqual([]);
      await attachScreenshot(page, 'Step 20 - After refresh');
    });
  });
});

async function getEventCards(page: Page): Promise<Locator> {
  const selectors = [
    '[data-testid="event-card"]',
    '[class*="event-item"]',
    '[class*="event-card"]',
    '[class*="eventCard"]',
    '[class*="event"]',
    'article',
    '.card',
  ];

  for (const selector of selectors) {
    const locator = page.locator(selector);
    if ((await locator.count()) > 0) {
      return locator;
    }
  }

  return page.locator('[class*="event"], article, .card');
}

async function expectNoCardOverlap(cards: Locator) {
  const count = await cards.count();
  const boxes: { x: number; y: number; width: number; height: number }[] = [];

  for (let i = 0; i < Math.min(count, 8); i++) {
    const box = await cards.nth(i).boundingBox();
    if (box) boxes.push(box);
  }

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];

      const overlap =
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;

      expect(overlap).toBeFalsy();
    }
  }
}

async function expectRoughlyEqualHeights(cards: Locator) {
  const count = await cards.count();
  const heights: number[] = [];

  for (let i = 0; i < Math.min(count, 6); i++) {
    const box = await cards.nth(i).boundingBox();
    if (box) heights.push(box.height);
  }

  if (heights.length >= 2) {
    const min = Math.min(...heights);
    const max = Math.max(...heights);
    expect(max - min).toBeLessThan(250);
  }
}

async function autoScrollToBottom(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 700;

      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
}

async function extractVisibleCardTitles(cards: Locator): Promise<string[]> {
  const count = await cards.count();
  const titles: string[] = [];

  for (let i = 0; i < Math.min(count, 20); i++) {
    const card = cards.nth(i);
    const title = card.locator('h1, h2, h3, h4').first();
    const text = (await title.textContent().catch(() => null))?.trim();

    if (text) titles.push(text);
  }

  return titles;
}

function getDuplicateRatio(values: string[]): number {
  if (values.length === 0) return 0;
  return 1 - new Set(values).size / values.length;
}

async function attachScreenshot(page: Page, name: string) {
  await allure.attachment(name, await page.screenshot({ fullPage: true }), 'image/png');
}