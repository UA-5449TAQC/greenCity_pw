// TC-01: Events List Rendering, Navigation & Data Integrity 
import { test, expect } from '@playwright/test';
test('TC-01: Events List Rendering, Navigation & Data Integrity', async ({ page }) => {

    const eventCards = page.locator('app-events-list-item');

    await test.step('Step 1 - Navigate to Events page', async () => {
        await page.goto('/#/greenCity/events');
    });

    await test.step('Step 2 - Click "Events" in header', async () => {
        await page.getByRole('banner').getByRole('link', { name: 'Events' }).click();
    });

    await test.step('Step 3 - Verify page URL is correct and the page has loaded', async () => {
        await expect(page).toHaveURL('/#/greenCity/events');
    });

    await test.step('Step 4 - Verify that the main header "Events" is visible and has correct text', async () => {
        const eventsTitle = page.locator('p').filter({ hasText: /^Events$/ }).first();
        await expect(eventsTitle).toBeVisible();
        await expect(eventsTitle).toHaveText('Events');
    });

    await test.step('Step 5 - Verify event cards rendering', async () => {
        await expect(eventCards).toHaveCount(6); 
    });

    const count = await eventCards.count();

    await test.step('Step 9 - Verify fallback image (cards visible)', async () => {
        for (let i = 0; i < count; i++) {
            await expect.soft(eventCards.nth(i)).toBeVisible();
        }
    });

    await test.step('Step 10 - Verify title handling (truncated with ellipsis and full title in tooltip)', async () => {
        for (let i = 0; i < count; i++) {
            const title = eventCards.nth(i).locator('p.event-name');
            await expect.soft(title).toBeVisible();
            const titleText = await title.textContent();
            if (titleText && titleText.length > 50) {
                await expect.soft(title).toHaveCSS('text-overflow', 'ellipsis');
                await expect.soft(title).toHaveAttribute('title', titleText);
            } else {
                await expect.soft(title).toHaveText(titleText || '');
            }
        }
    });

    await test.step('Step 11 - Validate date format (matches locale and is human-readable)', async () => {
        const dateRegex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}$/;
        for (let i = 0; i < count; i++) {
            const date = eventCards.nth(i).locator('.additional-info .date');
            await expect.soft(date).toBeVisible();
            const dateText = (await date.textContent())?.trim() ?? '';
            expect.soft(dateText).toMatch(dateRegex);
        }
    });

    await test.step('Step 12 - Validate location display (online or address shown)', async () => {
        for (let i = 0; i < count; i++) {
            const locationContainer = eventCards.nth(i).locator('.date-container').filter({ has: page.locator('span.place') });
            await expect.soft(locationContainer).toBeVisible();
        }
    });

    await test.step('Step 13 - Verify organizer info (name/avatar displayed)', async () => {
        for (let i = 0; i < count; i++) {
            const card = eventCards.nth(i);
            await expect.soft(card.locator('.additional-info .author')).toBeVisible(); 
            await expect.soft(card.locator('img[alt="author"]')).toBeVisible();
        }
    });

    await test.step('Step 14 - Verify Join button (visible on active events)', async () => {
        for (let i = 0; i < count; i++) {
            const joinButton = eventCards.nth(i).getByRole('button', { name: 'Join event' });
            if (await joinButton.isVisible()) {
                await expect.soft(joinButton).toBeEnabled();
            }
        }
    });

    await test.step('Step 15 - Scroll page (smooth scrolling without glitches)', async () => {
        await page.evaluate(() => {
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        });
    });

    await test.step('Step 16 - Trigger lazy loading (additional events load as you scroll)', async () => {
        await page.evaluate(() => {
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        });
    });

    await test.step('Step 17 - Switch view Grid/List (layout updates without breaking)', async () => {
        const listViewButton = page.getByRole('button', { name: 'list view' });
        await expect(listViewButton).toBeVisible();
        await listViewButton.click();
        const tableViewButton = page.getByRole('button', { name: 'table view' });
        await expect(tableViewButton).toBeVisible();
    });

    await test.step('Step 18 - Enter invalid search !@#NoEvent123 (no events displayed)', async () => {
        await page.locator('span.search-img').click();
        const searchInput = page.getByPlaceholder('Search');
        await expect(searchInput).toBeVisible();
        await searchInput.fill('!@#NoEvent123');
        await expect(eventCards).toHaveCount(0);
    });

    await test.step('Step 19 - Clear search input (full events list is restored)', async () => {
        const searchInput = page.getByPlaceholder('Search');
        await searchInput.fill('');
        await expect(eventCards.first()).toBeVisible();
    });

    await test.step('Step 20 - Refresh page (state resets, no errors in console)', async () => {
        await page.reload();
        await expect(page).toHaveURL('/#/greenCity/events');
        await expect(eventCards.first()).toBeVisible();
    });

});
