import {test as base, expect} from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { EcoNewsPage } from '../pages/EcoNewsPage';
import { EventsPage } from '../pages/EventsPage';
import env from '../config/env';


type PageFixtures = {
    homePage: HomePage;
    ecoNewsPage: EcoNewsPage;
    eventsPage: EventsPage;
    homePageLogined: HomePage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        // await homePage.navigateAndWait();
        await use(homePage);
    },
    ecoNewsPage: async ({ page }, use) => {
        const ecoNewsPage = new EcoNewsPage(page);
        await use(ecoNewsPage);
    },
    eventsPage: async ({ page }, use) => {
        const eventsPage = new EventsPage(page);
        await use(eventsPage);
    },
    homePageLogined: async ({ homePage }, use) => {
        // const homePage = new HomePage(page);
        await homePage.navigateAndWait();
        let loginModal = await homePage.getHeader().clickLoginLink();

        await loginModal.login(env.USER_EMAIL, env.USER_PASSWORD);
        await expect(homePage.page).toHaveURL(new RegExp(`.*/profile/1205`)); 
        await homePage.navigateAndWait();
        await use(homePage);

        
    }
});

export { expect };



