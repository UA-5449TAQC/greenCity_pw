
import { Locator, Page } from "playwright-core";
import { BaseComponent } from "./BaseComponent";
import { LoginModal } from "./LoginModal";

export class HeaderComponent extends BaseComponent {
    private logo: Locator;
    private EcoNewsLink: Locator;
    private EventsLink: Locator;
    private SignInLink: Locator;
    private SignInRootLocator: Locator;

    constructor(page: Page, root: Locator) {
        super(page, root);
        this.logo = this.root.getByAltText('Image green city logo');
        this.EcoNewsLink = this.root.getByRole('link', { name: ' Eco news ' });
        this.EventsLink = this.root.getByRole('link', { name: ' Events ' });
        this.SignInLink = this.root.getByRole('link', { name: 'Sign in' }).or(this.root.getByAltText('sing in button'));
        this.SignInRootLocator = this.page.locator('app-auth-modal');
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
    async clickLoginLink(): Promise<LoginModal> {
        await this.SignInLink.click();
        await this.SignInRootLocator.waitFor({ state: 'visible' });
        const loginModal = new LoginModal(this.page, this.SignInRootLocator);
        return loginModal;
    }

}