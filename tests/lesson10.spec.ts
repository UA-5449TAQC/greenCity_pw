import { test, expect } from '@playwright/test';


test('lesson10', async ({ page }) => {
    // Використовуйте селектори обережно, перевірте чи alt text саме такий
    await page.goto('/#/greenCity/');

    let eco_news_link = page.locator('a:has-text("Eco news")').first();
    await expect(eco_news_link).toBeVisible();
    await eco_news_link.click();

    let cards = page.locator('li.gallery-view-li-active');
    await expect(cards).toHaveCount(12);
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
        await expect.soft(cards.nth(i)).toBeVisible();
        await expect.soft(cards.nth(i)).toBeEnabled();
    }
    let first_card = cards.first();
    await first_card.click();
    let news_title = page.locator('div.news-title.word-wrap');
    await expect(news_title).toBeVisible();
    await expect(news_title).toHaveText(/Upcoming environmental event/);

});
