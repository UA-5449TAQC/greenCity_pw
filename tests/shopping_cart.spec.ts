import { test, expect } from '@playwright/test';

test.describe('greencity', () => {
    
    // ПРАВИЛЬНО: beforeAll використовує browser, а не page
    test.beforeAll(async ({ browser }) => {
        // Тут можна виконувати запити до API або БД через новий контекст, 
        // якщо це справді потрібно робити ОДИН раз на всі тести.
        console.log('Setting up global test data...');
    });

    // ПРАВИЛЬНО: afterAll НЕ МОЖЕ приймати { page }, бо сторінки вже не існує.
    // Якщо потрібно чистити дані через браузер, створіть новий контекст/сторінку всередині.
    test.afterAll(async () => {
        console.log('Cleaning up test data...');
    });

    // Runs before EACH test
    test.beforeEach(async ({ page }) => {
        console.log('Navigating to the shopping cart page...');
        // await page.goto('https://www.greencity.cx.ua/#/greenCity');
        await page.goto('/#/greenCity/');
        await page.waitForLoadState('networkidle');
    });

    // Runs after EACH test
    test.afterEach(async ({ page }, testInfo) => {
        console.log(`Finished test: ${testInfo.title}`);
        if (testInfo.status === 'passed') {
            // Створюємо папку, якщо вона не існує, або переконуємось, що шлях коректний
            await page.screenshot({ 
                path: `playwright-report/screenshots/${testInfo.title.replace(/\s+/g, '_')}.png` 
            });
        }
    });

    test('should have a title', async ({ page }) => {
        await expect(page).toHaveTitle(/GreenCity/);
    });

    test('check login modal', async ({ page }) => {
        // Використовуйте селектори обережно, перевірте чи alt text саме такий
        await page.getByAltText('sing in button').click();
        await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
        let emailInput = page.getByPlaceholder('example@email.com');
        let passwordInput = page.getByPlaceholder('Password');
        await expect.soft(emailInput).toBeDisabled();
        await expect.soft(passwordInput).toBeDisabled();

    });
});