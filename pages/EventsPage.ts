import { expect, Locator, Page } from '@playwright/test';

export class EventsPage {
  readonly page: Page;
  readonly filtersPanel: Locator;
  readonly activeFilterChips: Locator;
  readonly searchInput: Locator;
  readonly itemsFoundText: Locator;
  readonly eventList: Locator;
  readonly eventCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filtersPanel = page.locator('div.filter-container');
    this.activeFilterChips = page.locator('div.active-filter');
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.itemsFoundText = page.locator('p', { hasText: /Items found/i });
    this.eventList = page.locator('div.event-list');
    this.eventCards = page.locator(
      '[data-testid="event-card"], .event-card, .cards-item, .events-item, .event-list > *, app-event-item, app-events-list .item'
    );
  }

  async goto() {
    await this.page.goto('https://www.greencity.cx.ua/#/greenCity/events', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForLoadState('networkidle');
  }

  async openFilter(label: string) {
    const exact = this.page.getByText(label, { exact: true }).first();
    if (await exact.count()) {
      await exact.click({ force: true });
      return;
    }
    await this.page.getByText(new RegExp(label, 'i')).first().click({ force: true });
  }

  get listbox() {
    return this.page.locator('div[role="listbox"].mat-mdc-select-panel, div[role="listbox"]');
  }

  async selectOption(optionText: string) {
    const option = this.page.locator('[role="option"]', { hasText: optionText }).first();
    await expect(option).toBeVisible();
    await option.click();
  }

  async closeDropdown() {
    await this.page.keyboard.press('Escape').catch(() => {});
  }

  async removeChip(chipText: string) {
    const chip = this.activeFilterChips.filter({ hasText: chipText }).first();
    const cross = chip.locator('.cross-container').first();
    if (await cross.count()) {
      await cross.click();
    } else {
      await chip.locator('button, .mat-icon, svg').first().click({ force: true });
    }
  }

  async selectCity(city: string) {
    await this.page.getByText('Filter cities', { exact: true }).click();

    const dialog = this.page.locator('div.mat-mdc-dialog-surface, div.mdc-dialog__surface').first();
    await expect(dialog).toBeVisible();

    await dialog.locator('input').first().fill(city);
    await dialog.getByText(city, { exact: true }).first().click();
    await dialog.getByRole('button', { name: /Add selected cities/i }).click();

    await this.page.waitForLoadState('networkidle');
  }

  async chooseDatePreset(preset: 'Past' | 'Today' | 'Future') {
    const presetControl = this.page.getByText(new RegExp(`^${preset}$`, 'i')).first();
    await expect(presetControl).toBeVisible();
    await presetControl.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getVisibleCardsCount() {
    let visible = 0;
    const count = await this.eventCards.count();
    for (let i = 0; i < count; i++) {
      if (await this.eventCards.nth(i).isVisible()) visible++;
    }
    return visible;
  }

  async getVisibleCardTexts() {
    const texts: string[] = [];
    const count = await this.eventCards.count();
    for (let i = 0; i < count; i++) {
      const card = this.eventCards.nth(i);
      if (await card.isVisible()) texts.push((await card.innerText()).trim());
    }
    return texts;
  }

  async getItemsFoundCount() {
    const text = await this.itemsFoundText.first().innerText();
    const match = text.match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  async clearAll() {
    const button = this.page.getByRole('button', { name: /clear all/i }).first();
    if (await button.count()) {
      await button.click();
      return;
    }
    await this.page.getByText(/clear all/i).first().click({ force: true });
  }
}