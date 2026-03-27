import { test, expect } from '@playwright/test';
import { EcoNewsPage } from '../pages/EcoNewsPage';
import { EcoNewsItemPage } from '../pages/EcoNewsItemPage';
import { assert } from 'node:console';


test('lesson11', async ({ page }) => {
    const ecoNewsPage = new EcoNewsPage(page);
    await ecoNewsPage.navigateAndWait();
    await ecoNewsPage.assertOnPage();
    await expect.soft(ecoNewsPage.mainHeader).toBeVisible();
    await expect.soft(ecoNewsPage.mainHeader).toHaveText('Eco news');

    await expect.soft(ecoNewsPage.newsItemsCount).toBeVisible();
    await expect.soft(ecoNewsPage.newsItemsCount).toHaveText('2212 items found');

    const tags: string[] = await ecoNewsPage.getTagsList();
    await expect(tags).toHaveLength(5);
    await expect.soft(tags).toContain('News');
    await expect.soft(tags).toContain('Events');
    await expect.soft(tags).toContain('Education');
    await expect.soft(tags).toContain('Initiatives');
    await expect.soft(tags).toContain('Ads');

    await ecoNewsPage.clickTag('Education');
    await expect(ecoNewsPage.newsItemsCount).toHaveText('691 items found');
    await expect(ecoNewsPage.newsItems).toHaveCount(12);
    await ecoNewsPage.clickNewsItemByIndex(0);
    const newsItemPageUrl = new EcoNewsItemPage(page);
    await newsItemPageUrl.assertOnPage();
    await newsItemPageUrl.waitForPageReady();
    
    await expect.soft(newsItemPageUrl.title).toBeVisible();
    await expect.soft(newsItemPageUrl.title).toHaveText('New eco-friendly product launch');
    await expect.soft(newsItemPageUrl.tags.first()).toBeVisible();
    await expect.soft(newsItemPageUrl.tags).toHaveCount(2);
    await expect.soft(newsItemPageUrl.tags).toHaveText([' Education ', ' Ads ']);
    await expect.soft(newsItemPageUrl.author).toBeVisible();
    await expect.soft(newsItemPageUrl.author).toHaveText('by Hlib');
    await expect.soft(newsItemPageUrl.date).toBeVisible();
    await expect.soft(newsItemPageUrl.date).toHaveText('Mar 27, 2026');

    await expect.soft(newsItemPageUrl.backToNewsButton).toBeVisible();
    await newsItemPageUrl.backToNewsButton.click();

    await ecoNewsPage.assertOnPage();
    await expect(ecoNewsPage.newsItemsCount).toHaveText('691 items found');
    await expect(ecoNewsPage.newsItems).toHaveCount(12);
    await ecoNewsPage.clickTag('Education');
    await expect.soft(ecoNewsPage.newsItemsCount).toHaveText('2212 items found');

});
