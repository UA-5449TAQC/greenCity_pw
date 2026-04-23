import { test, expect } from "../fixtures/pages";


test('TC-1 Events List Page', async ({ homePage, eventsPage }) => {
    // 1	Navigate to homepage	URL	Page loads successfully (HTTP 200)
    await homePage.navigateAndWait();

    // 2	Click "Events" in header	-	Redirect to /greenCity/events
    await homePage.getHeader().clickEventsLink();

    // 3	Validate page URL	-	URL matches expected route
    await eventsPage.assertOnPage();

    // 4	Verify page title	-	"Events" header is visible
    await expect.soft(eventsPage.mainHeader).toBeVisible();
    await expect.soft(eventsPage.mainHeader).toHaveText('Events');

    // 5	Verify event cards rendering	-	Cards rendered
    // ??? with equal height, no overlap, no UI breaks
    await eventsPage.checkCardsVisible();
    await eventsPage.checkCardsEqualHeight();
    await eventsPage.checkCardsNoOverlap();

    // 9	Verify fallback image	Missing image	Placeholder image is displayed
    await eventsPage.checkCardsDefaultImage();

    // 10	Verify title handling	Long title	Title truncated with ellipsis
    await eventsPage.checkTitleTruncation();

    // 11	Validate date/time format	-	Matches locale and is human-readable
    let locale = await homePage.getHeader().getCurrentLocale();
    await eventsPage.checkDateTimeFormat(locale);

    //13	Verify organizer info	-	Name/avatar displayed
    await eventsPage.checkAllOrganizerInfo();
    const eventCard = await eventsPage.getCardByName('Clean test event');
    if (eventCard) {
        await eventsPage.checkOrganizerNameByCard(eventCard, 'WIMP QA');

        // 14	Verify Join button	-	Visible on active events
        await eventCard.assertJoinButtonVisible();
    }

    // 15	Scroll page	-	Smooth scrolling without glitches
    // 16	Trigger lazy loading	-	Additional events load without duplication
    const initialCount = await eventsPage.eventsCards.count();
    await eventsPage.page.mouse.wheel(0, 1000); // Scroll down more to trigger lazy loading
    await eventsPage.page.waitForTimeout(2000); // Wait for new items to load
    const newCount = await eventsPage.eventsCards.count();
    expect(newCount).toBeGreaterThan(initialCount); // Verify new items loaded

    //17	Switch view (Grid/List)	-	Layout updates without reload
    await eventsPage.switchToListView();
    await expect(eventsPage.listViewButton).toHaveAttribute('aria-pressed', 'true');
    await expect(eventsPage.gridViewButton).toHaveAttribute('aria-pressed', 'false');
    await eventsPage.checkCardsVisible(); // Verify cards are visible in list view

    await eventsPage.switchToGridView();
    await expect(eventsPage.listViewButton).toHaveAttribute('aria-pressed', 'false');
    await expect(eventsPage.gridViewButton).toHaveAttribute('aria-pressed', 'true');
    await eventsPage.checkCardsVisible(); // Verify cards are visible in grid view

    // 18	Enter invalid search	!@#NoEvent123	Empty state is displayed
    await eventsPage.enterSearchQuery('!@#NoEvent123');
    await expect(eventsPage.errorMessage).toBeVisible();
    await expect(eventsPage.errorMessage).toHaveText('We didn\'t find any results matching to this search');

    // 19	Clear search	-	Full list restored
    await eventsPage.clearSearch();
    await expect(eventsPage.errorMessage).toBeHidden();
    expect(await eventsPage.eventsCards.first().waitFor({ state: 'visible' }));
    expect(await eventsPage.eventsCards.count()).toBeGreaterThan(0);

    // 20	Refresh page	F5	State resets, no errors in console
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    eventsPage.page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    eventsPage.page.on('pageerror', error => {
        pageErrors.push(error.message);
    });

    await eventsPage.page.reload();
    await eventsPage.assertOnPage();
    await expect(eventsPage.errorMessage).toBeHidden();
    expect(await eventsPage.eventsCards.first().waitFor({ state: 'visible' }));
    expect(await eventsPage.eventsCards.count()).toBeGreaterThan(0);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
});
