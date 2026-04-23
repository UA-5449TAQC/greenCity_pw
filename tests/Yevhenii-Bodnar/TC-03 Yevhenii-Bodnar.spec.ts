//TC-03: Event Details Page & Guest Access Restrictions 
import { test, expect } from '@playwright/test';
import { getEventPageLocators, BASE_URL } from './PageConstants';

test('TC-03: Event Details Page & Guest Access Restrictions', async ({ page }) => {
const {
  filters, SocialCheckbox, allCards, TypeFilter, typeOptions,
  LocationFilter, DateRangeFilter, PreviousMonthButton, NextMonthButton,
  SearchButton, ResetAllButton, EventTimeFilters, CardDate, JoinEventButton,
  searchInput, cancelSearch, titleEventList
} = getEventPageLocators(page);

await page.goto(BASE_URL);

await test.step('1. Open event card', async () => {
await page.getByRole('button', { name: 'More' }).first().click();
});

await test.step('2. Verify URL contains numeric event ID', async () => {
await expect(page).toHaveURL(/\/#\/greenCity\/events\/\d+/);
});

await test.step('4. Validate image presence or fallback', async () => {
const eventImage = page.locator('.main-image');
await expect(eventImage).toBeVisible();
if (await eventImage.getAttribute('src') === '^https:\/\/.*\.blob\.core\.windows\.net\/.+/rc/img/habits/default-habit-image.png') {
  await expect.soft(eventImage).toHaveAttribute('src', '^https:\/\/.*\.blob\.core\.windows\.net\/.+/');
} else {
  await expect.soft(eventImage).toHaveAttribute('src', 'src/img/habits/default-habit-image.png');
}
});

await test.step('5. Validate title/date/time', async () => {
const titleEventListText = await titleEventList.textContent();
const titleEventCard = page.locator('.event-header .title');
await expect(titleEventCard).toBeVisible();
const titleEventCardText = await titleEventCard.textContent();
await expect(titleEventCardText).toEqual(titleEventListText);


});


});  

