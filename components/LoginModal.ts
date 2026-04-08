import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";
import { step } from "allure-js-commons";


export class LoginModal extends BaseComponent {
    private emailInput: Locator
    private passwordInput: Locator
    private loginButton: Locator

    constructor(page: Page, root: Locator) {
        super(page, root);
        this.emailInput = this.root.getByPlaceholder('example@email.com');
        this.passwordInput = this.root.getByPlaceholder('Password');
        this.loginButton = this.root.locator('button[type="submit"]');
    }

    async login(email: string, password: string): Promise<void> {
        await step(`Fill in email: ${email} and password: ${password} fields and click login button`, async () => {
            await this.emailInput.fill(email);
            await this.passwordInput.fill(password);
            await this.loginButton.click();
        });
    }
}