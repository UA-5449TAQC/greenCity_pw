import { test , expect} from '../fixtures/pages';


test('lesson13.1', async ({ homePage, eventsPage, ecoNewsPage}) => {
    
    await homePage.navigateAndWait();
    await homePage.getHeader().clickEventsLink();
    await expect(eventsPage.getCurrentUrl()).toContain('#/greenCity/events');
    eventsPage.getHeader().clickLogo();
    await expect(homePage.getCurrentUrl()).toContain('#/greenCity');
    await homePage.getHeader().clickEcoNewsLink();
    await expect(ecoNewsPage.getCurrentUrl()).toContain('#/greenCity/news');
    // let author = await ecoNewsPage.getCards().then(cards => cards[0].getAuthor());
    let cards = await ecoNewsPage.getCards();
    let author = await cards[0].getAuthor();
    let ecoNewsItemPage = await ecoNewsPage.clickNewsItemByIndex(0);
    await expect(ecoNewsItemPage.getCurrentUrl()).toContain('#/greenCity/news/');
    await expect(ecoNewsItemPage.title).toBeVisible();
    await expect(ecoNewsItemPage.author).toHaveText("by " + author);

});


test('lesson13.2', async ({ecoNewsPage }) => {

    await ecoNewsPage.navigateAndWait();

    let cards = await ecoNewsPage.getCards();
    await expect.soft(await cards[0].getTags()).toEqual(['Events']);
    await expect.soft(await cards[1].getTags()).toEqual(['Education', 'Ads']);
    await expect.soft(await cards[2].getTags()).toEqual(['News', 'Events']);

});


test('lesson13.3', async ({ homePageLogined, eventsPage, ecoNewsPage}) => {
    
    
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

