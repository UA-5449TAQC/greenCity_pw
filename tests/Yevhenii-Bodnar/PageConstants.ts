import { Page } from '@playwright/test';

export const BASE_URL = '/#/greenCity/events';

// Returns reusable locators for event page elements
export function getEventPageLocators(page: Page) {
  return {
    filters: page.getByText('Filter', { exact: true }).first(),
    SocialCheckbox: page.getByRole('option', { name: 'Social' }),
    allCards: page.locator('.event-card'),
    TypeFilter: page.getByText('Type', { exact: true }).first(),
    typeOptions: page.getByRole('option'),
    LocationFilter: page.getByText('Location', { exact: true }).first(),
    DateRangeFilter: page.getByText('Date range', { exact: true }).first(),
    PreviousMonthButton: page.getByRole('button', { name: 'Previous month' }),
    NextMonthButton: page.getByRole('button', { name: 'Next month' }),
    SearchButton: page.locator('.container-img.ng-star-inserted'),
    ResetAllButton: page.getByRole('button', { name: 'Reset all' }),
    EventTimeFilters: page.getByText('Event time', { exact: true }).first(),
    CardDate: page.locator('.date-container ng-star-inserted .date'),
    JoinEventButton: page.getByRole('button', { name: 'Join event' }),
    searchInput: page.getByPlaceholder('Search'),
    cancelSearch: page.getByAltText('cancel search'),
  };
}
