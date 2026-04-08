import { test, expect } from '../fixtures/pages';
import * as allure from "allure-js-commons";



test('lesson13.1', async ({ homePage, eventsPage, ecoNewsPage }) => {
    allure.epic('Online Store');
    allure.feature('Checkout');
    allure.story('Successful purchase');
    // ── Test owner ────────────────────────────────────────────────────────
    allure.owner('ivan.petrov@company.com');
    // ── Severity ──────────────────────────────────────────────────────────
    allure.severity("CRITICAL");
    // Severity: BLOCKER | CRITICAL | NORMAL | MINOR | TRIVIAL
    // ── Custom labels ─────────────────────────────────────────────────────
    allure.label('layer', 'e2e');
    allure.label('module', 'checkout');
    allure.label('sprint', 'Sprint-42');
    // ── Tags for filtering ────────────────────────────────────────────────
    allure.tag('smoke');
    allure.tag('regression');
    // ── Links ─────────────────────────────────────────────────────────────
    allure.issue('PROJ-1234', 'https://jira.company.com/browse/PROJ-1234');
    allure.tms('TC-567', 'https://testlink.company.com/case/TC-567');
    allure.link('https://wiki.company.com/checkout', 'Documentation');
    // ── Description (Markdown supported) ──────────────────────────────────
    allure.description("This test verifies that a user can successfully complete the checkout process. It covers the entire flow from adding items to the cart, proceeding to checkout, and confirming the order. The test ensures that all steps are functioning correctly and that the user receives a confirmation message upon successful purchase.");

    await allure.step('Navigate to home page and verify main sections', async () => {
        await homePage.navigateAndWait();
        await homePage.getHeader().clickEventsLink();
        await expect(eventsPage.getCurrentUrl()).toContain('#/greenCity/events');
    });

    await allure.step('Navigate to Eco News and verify first news item details', async () => {
        eventsPage.getHeader().clickLogo();
        await expect(homePage.getCurrentUrl()).toContain('#/greenCity');
        await homePage.getHeader().clickEcoNewsLink();
        await expect(ecoNewsPage.getCurrentUrl()).toContain('#/greenCity/news');
        // let author = await ecoNewsPage.getCards().then(cards => cards[0].getAuthor());

    });
    await allure.step('Verify news item page details', async () => {
        let cards = await ecoNewsPage.getCards();
        let author = await cards[0].getAuthor();
        let ecoNewsItemPage = await ecoNewsPage.clickNewsItemByIndex(0);
        await expect(ecoNewsItemPage.getCurrentUrl()).toContain('#/greenCity/news/');
        await expect(ecoNewsItemPage.title).toBeVisible();
        await expect(ecoNewsItemPage.author).toHaveText("by " + author);
    });
    await allure.step('Click on Sign in link in header and perform login', async () => {
        await homePage.navigateAndWait();
        let loginModal = await homePage.getHeader().clickLoginLink();
        await loginModal.login('test@example.com', 'test');

    });

});


test('lesson13.2', async ({ ecoNewsPage }) => {

    await ecoNewsPage.navigateAndWait();

    let cards = await ecoNewsPage.getCards();
    await expect.soft(await cards[0].getTags()).toEqual(['Events']);
    await expect.soft(await cards[1].getTags()).toEqual(['Education', 'Ads']);
    await expect.soft(await cards[2].getTags()).toEqual(['News', 'Events']);

});


test('lesson13.3', async ({ homePageLogined, eventsPage, ecoNewsPage }) => {


    await homePageLogined.getHeader().clickEventsLink();
    await expect(eventsPage.getCurrentUrl()).toContain('#/greenCity/events');
    eventsPage.getHeader().clickLogo();
    await expect(homePageLogined.getCurrentUrl()).toContain('#/greenCity');
    await homePageLogined.getHeader().clickEcoNewsLink();
    await expect(ecoNewsPage.getCurrentUrl()).toContain('#/greenCity/news');
    // let author = await ecoNewsPage.getCards().then(cards => cards[0].getAuthor());
    let cards = await ecoNewsPage.getCards();
    let author = await cards[0].getAuthor();
    let ecoNewsItemPage = await ecoNewsPage.clickNewsItemByIndex(0);
    await expect(ecoNewsItemPage.getCurrentUrl()).toContain('#/greenCity/news/');
    await expect(ecoNewsItemPage.title).toBeVisible();
    await expect(ecoNewsItemPage.author).toHaveText("by " + author);

});

