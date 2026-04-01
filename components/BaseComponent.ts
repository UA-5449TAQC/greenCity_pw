import { Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
  /** The page the component lives on — for keyboard/page-level actions */
  protected readonly page: Page;

  /** The root locator that scopes ALL child locators in this component */
  protected readonly root: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
  }

  // ── Visibility helpers ────────────────────────────────────────────────

  /** Is the component's root element visible? */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Wait for the component to appear. */
  async waitUntilVisible(timeout?: number): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  /** Wait for the component to disappear. */
  async waitUntilHidden(timeout?: number): Promise<void> {
    await this.root.waitFor({ state: 'hidden', timeout });
  }

  // ── Scoped locator helpers ────────────────────────────────────────────

  /**
   * Find an element INSIDE this component.
   * Always prefer this over page.locator() inside a component class.
   */
  protected locator(selector: string): Locator {
    return this.root.locator(selector);
  }

  protected getByRole(
    role: Parameters<Locator['getByRole']>[0],
    options?: Parameters<Locator['getByRole']>[1]
  ): Locator {
    return this.root.getByRole(role, options);
  }

  protected getByLabel(text: string, options?: { exact?: boolean }): Locator {
    return this.root.getByLabel(text, options);
  }

  protected getByTestId(testId: string): Locator {
    return this.root.getByTestId(testId);
  }

  protected getByText(text: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.root.getByText(text, options);
  }
}