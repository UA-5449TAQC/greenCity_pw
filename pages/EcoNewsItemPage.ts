import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class EcoNewsItemPage extends BasePage {

    readonly title: Locator;
    readonly tags: Locator;
    readonly author: Locator;
    readonly date: Locator;
    readonly backToNewsButton: Locator;


    constructor(page: Page) {
        super(page);
        this.title = page.locator('.news-title-container');
        this.tags = page.locator('div.tags-item');
        this.author = page.locator('div.news-info-author');
        this.date = page.locator('div.news-info-date');
        this.backToNewsButton = page.locator("div.button-text").getByText('Back to news');

    }

    get url(): string {
        return  '#/greenCity/news/' + this.getNewsIdFromUrl();
    }

    getNewsIdFromUrl(): string {
        const currentUrl = this.getCurrentUrl();
        const urlParts = currentUrl.split('/');
        return urlParts[urlParts.length - 1];
    }




}