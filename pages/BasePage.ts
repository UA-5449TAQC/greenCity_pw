import { Page, expect } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export abstract class BasePage {
    public page: Page;
    protected header: HeaderComponent;

    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page, this.page.locator('header'));
        
    }

    // ── Abstract contract ─────────────────────────────────────────────────────

    /** Each subclass declares its own URL path. */
    abstract get url(): string;

    // ── Navigation ────────────────────────────────────────────────────────────

    /** Navigate to this page's URL. */
    async navigate(): Promise<void> {
        await this.page.goto(this.url);
    }

    /** Navigate and wait until the page is fully loaded. */
    async navigateAndWait(): Promise<void> {
        await this.navigate();
        await this.waitForPageReady();
    }

    /** Wait for network to be idle (no pending requests for 500ms). */
    async waitForPageReady(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /** Assert the browser is currently on this page. */
    async assertOnPage(): Promise<void> {
        await expect(this.page, `Should be on ${this.url}`)
            .toHaveURL(new RegExp(this.url));
    }
    getCurrentUrl(): string {
        return this.page.url();
    }

    getHeader(): HeaderComponent {
        return this.header;
    }

}
