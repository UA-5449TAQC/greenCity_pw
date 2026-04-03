import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { EcoNewsPage } from '../pages/EcoNewsPage';
import { EventsPage } from '../pages/EventsPage';


test('lesson12', async ({ page }) => {
    
    let homePage = new HomePage(page);
    await homePage.navigateAndWait();
    await homePage.getHeader().clickEventsLink();
    let eventsPage = new EventsPage(page);
    await expect(eventsPage.getCurrentUrl()).toContain('#/greenCity/events');
    eventsPage.getHeader().clickLogo();
    // homePage = new HomePage(page);
    await expect(homePage.getCurrentUrl()).toContain('#/greenCity');
    await homePage.getHeader().clickEcoNewsLink();
    let ecoNewsPage = new EcoNewsPage(page);
    await expect(ecoNewsPage.getCurrentUrl()).toContain('#/greenCity/news');
    let cards = await ecoNewsPage.getCards();
    let author = await cards[0].getAuthor();
    let ecoNewsItemPage = await ecoNewsPage.clickNewsItemByIndex(0);
    await expect(ecoNewsItemPage.getCurrentUrl()).toContain('#/greenCity/news/');
    await expect(ecoNewsItemPage.title).toBeVisible();
    await expect(ecoNewsItemPage.author).toHaveText("by " + author);

});


test('lesson12.2', async ({ page }) => {
    let ecoNewsPage = new EcoNewsPage(page);
    await ecoNewsPage.navigateAndWait();

    let cards = await ecoNewsPage.getCards();
    await expect.soft(await cards[0].getTags()).toEqual(['Events']);
    await expect.soft(await cards[1].getTags()).toEqual(['Education', 'Ads']);
    await expect.soft(await cards[2].getTags()).toEqual(['News', 'Events']);

});

