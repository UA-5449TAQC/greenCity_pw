import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class EcoNewsPage extends BasePage {

    readonly mainHeader: Locator;
    readonly newsItemsCount: Locator;
    readonly tagsList: Locator;
    readonly newsItems: Locator;


    constructor(page: Page) {
        super(page);
        this.mainHeader = page.locator('h1.main-header');
        this.newsItemsCount = page.getByRole('heading', { name: 'items found' });
        this.tagsList = page.locator('button.tag-button');
        this.newsItems = page.locator('li.gallery-view-li-active');
    }

    get url(): string {
        return '#/greenCity/news';
    }

    async getTagsList(): Promise<string[]> {
        const tagsCount = await this.tagsList.count();
        const tags: string[] = [];
        for (let i = 0; i < tagsCount; i++) {
            tags.push(await this.tagsList.nth(i).innerText());
        }        
        
        return tags;
    }

    async clickTag(tagName: string): Promise<void> {
        await this.tagsList.filter({ hasText: tagName }).first().click();
    }

    async clickNewsItemByIndex(index: number): Promise<void> {
        await this.newsItems.nth(index).click();
    }


}