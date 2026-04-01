import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { EcoNewsItemPage } from "./EcoNewsItemPage";
import { EcoNewsCard } from "../components/EcoNewsCard";
export class EcoNewsPage extends BasePage {

    readonly mainHeader: Locator;
    readonly newsItemsCount: Locator;
    readonly tagsList: Locator;
    readonly newsItems: Locator;
    protected cards: EcoNewsCard[] = [];


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

    async getCards(): Promise<EcoNewsCard[]> {
        await this.newsItems.first().waitFor({ state: 'visible' });
        let items = await this.newsItems.all();
        items.forEach((item) => {
            this.cards.push(new EcoNewsCard(this.page, item));
        });
        return this.cards;
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

    async clickNewsItemByIndex(index: number): Promise<EcoNewsItemPage> {
        await this.newsItems.nth(index).click();
        return new EcoNewsItemPage(this.page);
    }


}