
import { Locator, Page } from "playwright-core";
import { BaseComponent } from "./BaseComponent";

export class HeaderComponent extends BaseComponent {
    private logo: Locator;
    private EcoNewsLink: Locator;
    private EventsLink: Locator;

    constructor(page: Page, root: Locator) {
        super(page, root);
        this.logo = this.root.getByAltText('Image green city logo');
        this.EcoNewsLink = this.root.getByRole('link', { name: ' Eco news ' });
        this.EventsLink = this.root.getByRole('link', { name: ' Events ' });
    }

    async clickLogo(): Promise<void> {
        await this.logo.click();
    }

    async clickEcoNewsLink(): Promise<void> {
        await this.EcoNewsLink.click();
    }

    async clickEventsLink(): Promise<void> {
        await this.EventsLink.click();
    }

}