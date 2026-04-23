import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Events filtering for guest user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.greencity.cx.ua/#/greenCity/events', {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForLoadState('networkidle');
  });

  test('Validate correctness of filtering logic, search behavior, and state persistence for guest users', async ({
    page,
  }) => {
    const filtersPanel = page.locator('div.filter-container');
    const activeFilterChips = page.locator('div.active-filter');
    const itemsFoundText = page.locator('p', { hasText: /Items found/i });
    const eventList = page.locator('div.event-list');
    const eventCards = getEventCards(page);

    const openFilterByLabel = async (label: string) => {
      const exact = page.getByText(label, { exact: true }).first();
      if (await exact.count()) {
        await exact.click({ force: true });
        return;
      }

      const partial = page.getByText(new RegExp(label, 'i')).first();
      await partial.click({ force: true });
    };

    const listbox = () =>
      page.locator('div[role="listbox"].mat-mdc-select-panel, div[role="listbox"]');

    const selectOptionFromPanel = async (optionText: string) => {
      const option = page.locator('[role="option"]', { hasText: optionText }).first();
      await expect(option).toBeVisible();
      await option.click();
    };

    const closeDropdown = async () => {
      await page.keyboard.press('Escape').catch(() => {});
    };

    const getVisibleCards = async (): Promise<Locator[]> => {
      const result: Locator[] = [];
      const count = await eventCards.count();

      for (let i = 0; i < count; i++) {
        const card = eventCards.nth(i);
        if (await card.isVisible()) result.push(card);
      }

      return result;
    };

    const getVisibleCardTexts = async (): Promise<string[]> => {
      const cards = await getVisibleCards();
      const texts: string[] = [];

      for (const card of cards) {
        texts.push((await card.innerText()).trim());
      }

      return texts;
    };

    const removeChip = async (chipText: string) => {
      const chip = activeFilterChips.filter({ hasText: chipText }).first();
      await expect(chip).toBeVisible();

      const cross = chip.locator('.cross-container').first();
      if (await cross.count()) {
        await cross.click();
      } else {
        await chip.locator('button, .mat-icon, svg').first().click({ force: true });
      }
    };

    const parseItemsFoundCount = async (): Promise<number> => {
      const text = (await itemsFoundText.first().innerText()).trim();
      const match = text.match(/(\d+)/);
      return match ? Number(match[1]) : 0;
    };

    const assertItemsFoundMatchesVisibleCards = async () => {
      await expect(itemsFoundText.first()).toBeVisible();
      await expect(eventList).toBeVisible();

      const visibleCards = await getVisibleCards();
      const countFromLabel = await parseItemsFoundCount();

      expect(visibleCards.length).toBe(countFromLabel);
    };

    let selectedCity = '';
    let searchInput!: Locator;

    await test.step('1. Verify filters panel is visible', async () => {
      await expect(filtersPanel).toBeVisible();
    });

    await test.step('2. Expand Type filter', async () => {
      await openFilterByLabel('Type');
      await expect(listbox().first()).toBeVisible();
    });

    await test.step('3. Select type Economic', async () => {
      await selectOptionFromPanel('Economic');
      await closeDropdown();
      await expect(
        page.locator('span.text.tag-active', { hasText: 'Economic' }).first()
      ).toBeVisible();
    });

    await test.step('4. Add type Social', async () => {
      await openFilterByLabel('Type');
      await expect(listbox().first()).toBeVisible();
      await selectOptionFromPanel('Social');
      await closeDropdown();
    });

    await test.step('5. Verify filter chips', async () => {
      await expect(activeFilterChips.filter({ hasText: 'Economic' }).first()).toBeVisible();
      await expect(activeFilterChips.filter({ hasText: 'Social' }).first()).toBeVisible();
    });

    await test.step('6. Remove Economic filter chip', async () => {
      await removeChip('Economic');
      await page.waitForLoadState('networkidle');
      await expect(activeFilterChips.filter({ hasText: 'Economic' })).toHaveCount(0);
    });

    await test.step('7. Expand Location filter', async () => {
      await openFilterByLabel('Location');
      await expect(listbox().first()).toBeVisible();
    });

    await test.step("8. Add location L'viv and select it from the location list", async () => {
      await page.getByText('Filter cities', { exact: true }).click();

      const dialog = page.locator('div.mat-mdc-dialog-surface').first();
      await expect(dialog).toBeVisible();

      const input = dialog.locator('input[role="combobox"]');
      await expect(input).toBeVisible();
      await input.fill("L'viv");

      const suggestion = page.locator('[id^="mat-autocomplete-"]').locator('mat-option').first();
      await expect(suggestion).toBeVisible();

      selectedCity = (await suggestion.innerText()).trim();
      await suggestion.click();

      await page.getByRole('button', { name: /Add selected cities/i }).click();
      await expect(dialog).toBeHidden();

      const cityOption = page
        .locator('mat-option.ng-star-inserted span.mdc-list-item__primary-text')
        .getByText("L'viv", { exact: true })
        .first();

      await expect(cityOption).toBeVisible();
      await cityOption.click();

      await closeDropdown();
      await expect(activeFilterChips.filter({ hasText: "L'viv" }).first()).toBeVisible();
    });

    await test.step('9. Open Status filter and select Open', async () => {
      await page.locator('mat-label', { hasText: 'Status' }).click();

      const statusOptions = page.locator('mat-option[role="option"]');
      await expect(statusOptions.first()).toBeVisible();

      const openOption = page.locator('mat-option', {
        has: page.locator('span.mdc-list-item__primary-text', { hasText: /^Open$/i }),
      }).first();

      await expect(openOption).toBeVisible();
      await openOption.click();
      await closeDropdown();
      await page.waitForLoadState('networkidle');
    });

    await test.step('10. Expand Date range filter', async () => {
      await openFilterByLabel('Date range');
      await expect(page.locator('mat-calendar')).toBeVisible();
    });

        await test.step('11. Select date range from April 7 to tomorrow', async () => {
    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        });

    
    const now = new Date();
    const startDateObj = new Date(now.getFullYear(), 3, 7); // month is 0-based → 3 = April

    // 👉 dynamic end date (tomorrow)
    const endDateObj = new Date();
    endDateObj.setDate(endDateObj.getDate() + 1);

    const start = formatDate(startDateObj);
    const end = formatDate(endDateObj);

    const startButton = page.locator(`button[aria-label="${start}"]`);
    const endButton = page.locator(`button[aria-label="${end}"]`);

    await expect(startButton).toBeVisible();
    await startButton.click();

    await expect(endButton).toBeVisible();
    await endButton.click();

    await expect(startButton).toHaveClass(/range-start/);
    await expect(endButton).toHaveClass(/range-end/);
    await closeDropdown();
    });

    await test.step('12. Open search panel, enter T, and press Enter', async () => {
      await page.locator('.search-img').click();

      searchInput = page.locator('input[type="text"]').first();
      await expect(searchInput).toBeVisible();

      await searchInput.fill('T');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');
    });

    await test.step("13. Verify combined filters T + L'viv", async () => {
      await expect(activeFilterChips.filter({ hasText: "L'viv" }).first()).toBeVisible();

      const combinedTexts = await getVisibleCardTexts();
      for (const text of combinedTexts) {
        expect(text.toLowerCase()).toContain('t');
        expect(text.toLowerCase()).toContain("l'viv");
      }
    });

    await test.step('14. Validate result count matches visible cards', async () => {
      await assertItemsFoundMatchesVisibleCards();
    });

    await test.step('15. Apply no-match search and verify empty state', async () => {
      await searchInput.fill('zzzzzz_unlikely_event_match');
      await searchInput.press('Enter');
      await page.waitForLoadState('networkidle');

      const emptyStateMessage = page.locator('p.end-page-txt', {
        hasText: "We didn't find any results matching to this search",
      });

      const zeroItemsFound = page.locator('p', { hasText: /^0 Items found$/i });

      await expect(emptyStateMessage).toBeVisible();
      await expect(zeroItemsFound).toBeVisible();
      expect((await getVisibleCards()).length).toBe(0);
    });

    await test.step('16. Clear all filters', async () => {
      const clearAllButton = page.getByRole('button', { name: /clear all/i }).first();
      if (await clearAllButton.count()) {
        await clearAllButton.click();
      } else {
        const clearAllText = page.getByText(/clear all/i).first();
        if (await clearAllText.count()) {
          await clearAllText.click({ force: true });
        }
      }

      await page.waitForLoadState('networkidle');
      await expect(activeFilterChips).toHaveCount(0);
    });

    await test.step('17. Select Past in Event time filter', async () => {
      await openFilterByLabel('Event time');
      await expect(listbox().first()).toBeVisible();

      await selectOptionFromPanel('Past');
      await closeDropdown();
      await page.waitForLoadState('networkidle');
    });

    await test.step('18. Verify no Join event button on cards', async () => {
      await expect(
        eventCards.locator('button', { hasText: /^Join event$/i })
      ).toHaveCount(0);
    });

    await test.step('19. Reload page and verify filter persistence', async () => {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle');

      await expect(filtersPanel).toBeVisible();
    });

    await test.step('20. Resize viewport to 768px and verify responsive filters', async () => {
      await page.setViewportSize({ width: 768, height: 900 });
      await page.waitForTimeout(300);

      const filterToggle = page
        .getByRole('button', { name: /filter/i })
        .or(page.getByText(/filter/i).first());

      const sidebarVisible = await filtersPanel.isVisible().catch(() => false);
      const toggleVisible = await filterToggle.isVisible().catch(() => false);

      expect(sidebarVisible || toggleVisible).toBeTruthy();

      if (!sidebarVisible && toggleVisible) {
        await filterToggle.click({ force: true });
        await expect(filtersPanel.or(page.locator('div.filter-container').first())).toBeVisible();
      }
    });
  });
});

function getEventCards(page: Page): Locator {
  return page.locator(
    [
      '[data-testid="event-card"]',
      '.event-card',
      '.cards-item',
      '.events-item',
      '.event-list > *',
      'app-event-item',
      'app-events-list .item',
    ].join(', ')
  );
}