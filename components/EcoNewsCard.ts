import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";
import { EcoNewsItemPage } from "../pages/EcoNewsItemPage";

export class EcoNewsCard extends BaseComponent {

    private title: Locator;
    private description: Locator;
    private tags: Locator;
    private userData: Locator;

    constructor(page: Page, root: Locator) {
        super(page, root);
        this.title = this.root.locator('h3');
        this.description = this.root.locator('list-text');
        this.userData = this.root.locator('.user-data-added-news span');
        this.tags = this.root.locator('.filter-tag span');
    }

    async getTitle(): Promise<string> {
        return await this.title.innerHTML();
    }

    async getDescription(): Promise<string> {
        return await this.description.innerHTML();
    }

    async getTags(): Promise<string[]> {
        const tagElements = await this.tags.all();
        const tagTexts: string[] = [];
        for (const tag of tagElements) {
            let tagText = (await tag.innerHTML()).trim();
            if (tagText !== '|') {
                tagTexts.push(tagText);
            }
        }
        return tagTexts;
    }

    async getPublishDate(): Promise<string> {
        return await this.userData.nth(0).innerText();
    }
    async getAuthor(): Promise<string> {
        return await this.userData.nth(1).innerText();
    }
    async getCommentCount(): Promise<number> {
        const commentCount = await this.userData.nth(2).innerText();
        return commentCount ? parseInt(commentCount, 10) : 0;
    }
    async getLikeCount(): Promise<number> {
        const likeCount = await this.userData.nth(3).innerText();
        return likeCount ? parseInt(likeCount, 10) : 0;
    }
    async click(): Promise<EcoNewsItemPage> {
        await this.root.click();
        return new EcoNewsItemPage(this.page);
    }
}