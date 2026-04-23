// TC-02: Filtering, Search & State Management
import { test, expect } from '@playwright/test';
import { getEventPageLocators, BASE_URL } from './PageConstants';

test('TC-02: Filtering, Search & State Management', async ({ page }) => {
const {
  filters, SocialCheckbox, allCards, TypeFilter, typeOptions,
  LocationFilter, DateRangeFilter, PreviousMonthButton, NextMonthButton,
  SearchButton, ResetAllButton, EventTimeFilters, CardDate, JoinEventButton,
  searchInput, cancelSearch
} = getEventPageLocators(page);

//const filters = page.getByText('Filter', { exact: true }).first();
//const SocialCheckbox = page.getByRole('option', {name: 'Social'});
//const allCards = page.locator('.event-card');
//const TypeFilter = page.getByText('Type', { exact: true }).first();
//const typeOptions = page.getByRole('option');
const typeNames = await typeOptions.allInnerTexts();
//const LocationFilter = page.getByText('Location', { exact: true }).first();
//const DateRangeFilter = page.getByText('Date range', { exact: true }).first();
//const PreviousMonthButton = page.getByRole('button', { name: 'Previous month' });
//const NextMonthButton = page.getByRole('button', { name: 'Next month' });
//const SearchButton = page.locator('.container-img.ng-star-inserted');
//const ResetAllButton = page.getByRole('button', { name: 'Reset all' });
//const EventTimeFilters = page.getByText('Event time', { exact: true }).first();
const Today = new Date();
//const CardDate = page.locator('.date-container ng-star-inserted .date');
const count = await CardDate.count();
//const JoinEventButton = page.getByRole('button', { name: 'Join event' });

await page.goto(BASE_URL);

await test.step('1. Verify filters panel is visible', async () => {
await expect.soft(filters).toBeVisible();
});

await test.step('2+3. Expand Type category in Filters panel and select "Social" option', async () => {
//const TypeFilter = page.getByText('Type', { exact: true }).first();
await TypeFilter.click();

      //const SocialCheckbox = page.getByRole('option', {name: 'Social'});
await expect(SocialCheckbox).toBeVisible();
await SocialCheckbox.click();
});

await test.step('4. Verify that only events of type "Social" are displayed', async () => {
       //const SocialEventCards = page.getByRole('button').filter({ has: page.getByText('Social') });
       //await expect(SocialEventCards).toHaveCount(await SocialEventCards.count());
      //const allCards = page.locator('.event-card'); 
for (const card of await allCards.all()) {  // Loop through all event cards
  await expect(card).toContainText('Social'); // Verify each card contains "Social" in its type information
}
});

await test.step('6. Unselect Social option. Results update accordingly', async () => {
  await SocialCheckbox.click();
for (const type of typeNames) {
  const cardsOfType = page.locator('.event-card').filter({ hasText: type });
  await expect.soft(cardsOfType.first()).toBeVisible({ 
    timeout: 5000 
  });

}

  await TypeFilter.click({force: true});

});
await test.step('7+8+9. Select "Kyiv" and Online in Location filter', async () => {
  await LocationFilter.click();
//await page.getByRole('option', { name: /Kyiv/ }).waitFor({ state: 'visible' });
//await page.getByRole('option', { name: /Kyiv/ }).click();
  //await page.getByRole('option', { name: 'Kyiv' }).click();
  //for (const card of await allCards.all()) // Loop through all event cards
  //await expect(card).toContainText('Kyiv');
await page.getByRole('option', { name: /Online/ }).click();
for (const card of await allCards.all()) // Loop through all event cards
  await expect(card).toContainText('Online'); // Verify each card contains "Online" in its location information
});

  await LocationFilter.click({force: true});

await test.step('10-11. Date Filter', async () => {
// Past month
  await DateRangeFilter.click();
await PreviousMonthButton.click();
await page.getByRole('gridcell', { name: 'March 1,'}).click();
await page.getByRole('gridcell', { name: 'March 31,'}).click();
 for (const card of await allCards.all()) 
 await expect(card).toContainText('March')

 // Current month
 await DateRangeFilter.click();
 await NextMonthButton.click();
await page.getByRole('gridcell', { name: 'April 1,'}).click();
await page.getByRole('gridcell', { name: 'April 30,'}).click();
for (const card of await allCards.all()) 
 await expect(card).toContainText('April')

// Future month
 await DateRangeFilter.click();
 await NextMonthButton.click();
await page.getByRole('gridcell', { name: 'May 1,'}).click();
await page.getByRole('gridcell', { name: 'May 31,'}).click();
for (const card of await allCards.all()) 
 await expect(card).toContainText('May')
});

await test.step('12. Enter search keyword "Clean"', async () => {
await SearchButton.click();
await page.getByPlaceholder('Search').fill('Clean');
for (const card of await allCards.all()) 
 await expect(card).toContainText('Clean');
});

await cancelSearch.click();
await cancelSearch.click();

await test.step('13-14. Combine filters "Search" and "Location"', async () => {
await SearchButton.click();
await page.getByPlaceholder('Search').fill('Clean');
await LocationFilter.click();  
await page.getByRole('option', { name: /Online/ }).click();
for (const card of await allCards.all()) // Loop through all event cards
  await expect(card).toContainText('Online');
});

await LocationFilter.click({force: true});

await test.step('15. Verify that all filters are cleared', async () => {
await page.getByAltText('cancel search').click();
await page.getByAltText('cancel search').click();
await ResetAllButton.click();

});

await test.step('16. Filter by Event Time', async () => {
await EventTimeFilters.click();
await page.getByRole('option', { name: /Past/ }).click();
for (let i = 0; i < count; i++) {
  const dateText = await CardDate.nth(i).textContent();
  const cardDate = new Date(dateText!.trim());
  expect(cardDate.getTime()).toBeGreaterThan(Today.getTime());
};

await page.getByRole('option', { name: /Past/ }).click();
await page.getByRole('option', { name: /Upcoming/ }).click();
for (let i = 0; i < count; i++) {
  const dateText = await CardDate.nth(i).textContent();
  const cardDate = new Date(dateText!.trim());
  expect(cardDate.getTime()).toBeLessThan(Today.getTime());
};
});

await test.step('17. Verify that no Join button is for past events', async () => {
await page.getByRole('option', { name: /Upcoming/ }).click();
await page.getByRole('option', { name: /Past/ }).click();
expect ( JoinEventButton).toBeHidden();
});

await test.step('18. Filters are present after page reload', async () => {
await page.reload();
expect.soft(ResetAllButton).toBeEnabled();
});
});
