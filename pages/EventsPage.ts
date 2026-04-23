import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { EventCard } from "../components/EventCard";

export class EventsPage extends BasePage {
    readonly mainHeader: Locator;
    readonly listViewButton: Locator;
    readonly gridViewButton: Locator;
    readonly eventsCards: Locator;
    readonly searchInput: Locator;
    readonly openSearchButton: Locator;
    readonly xSearchButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.mainHeader = page.locator('p.main-header');
        this.listViewButton = page.locator('.list');
        this.gridViewButton = page.locator('.gallery');
        this.eventsCards = page.locator('app-events-list-item');
        this.searchInput = page.getByPlaceholder('Search');
        this.openSearchButton = page.locator('.search-img');
        this.xSearchButton = page.getByAltText('cancel search');
        this.errorMessage = page.locator('p.end-page-txt');
    }

    get url(): string {
        return '#/greenCity/events';
    }

    async getCards(): Promise<EventCard[]> {
        await expect(this.eventsCards.first()).toBeVisible();

        const count = await this.eventsCards.count();
        const cards: EventCard[] = [];

        for (let i = 0; i < count; i++) {
            cards.push(new EventCard(this.page, this.eventsCards.nth(i)));
        }

        return cards;
    }

    async getCardByName(name: string): Promise<EventCard | null> {
        const cards = await this.getCards();
        for (const card of cards) {
            if (await card.getTitle() === name) {
                return card;
            }
        }
        return null;
    }

    async checkCardsVisible(): Promise<void> {
        const cards = await this.getCards();
        for (const card of cards) {
            await card.assertVisible();
            await card.assertNoUIBreaks();
        }
    }

    async checkCardsDefaultImage(): Promise<void> {
        const cards = await this.getCards();
        for (const card of cards) {
            if (await card.assertUploadedImage() == false) {
                await card.assertDefaultImage();
            }
        }
    }

    async checkTitleTruncation(): Promise<void> {
        const cards = await this.getCards();
        for (const card of cards) {
            await card.assertTitleTextOverflow();
        }
    }

    async checkDateTimeFormat(locale: string): Promise<void> {
        const cards = await this.getCards();
        for (const card of cards) {
            await card.assertDateTimeFormat(locale);
        }
    }

    async checkAllOrganizerInfo(): Promise<void> {
        const cards = await this.getCards();
        for (const card of cards) {
            expect.soft(await card.getOrganizerName()).not.toBe('');
            expect.soft(await card.getOrganizerAvatarSrc()).not.toBe('');
        }
    }

    async checkOrganizerNameByCard(card: EventCard, expectedName: string): Promise<void> {
        expect.soft(await card.getOrganizerName()).toBe(expectedName);
    }

    async switchToListView(): Promise<void> {
        await this.listViewButton.click();
    }

    async switchToGridView(): Promise<void> {
        await this.gridViewButton.click();
    }

    async enterSearchQuery(query: string): Promise<void> {
        await this.openSearchButton.click();
        await expect(this.searchInput).toBeVisible();
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
    }

    async clearSearch(): Promise<void> {
        await this.xSearchButton.click();
    }

    async checkCardsEqualHeight(): Promise<void> {
        const cards = await this.getCards();
        let previousHeight: number | null = null;

        for (const card of cards) {
            const height = await card.getCardHeight();
            if (previousHeight !== null) {
                expect(height).toBe(previousHeight);
            }
            previousHeight = height;
        }
    }

    async checkCardsNoOverlap(): Promise<void> {
        const cards = await this.getCards();
        const boundingBoxes = await Promise.all(cards.map(card => card.getBoundingBox()));

        for (let i = 0; i < boundingBoxes.length; i++) {
            for (let j = i + 1; j < boundingBoxes.length; j++) {
                const boxA = boundingBoxes[i];
                const boxB = boundingBoxes[j];
                if (boxA && boxB) {
                    const overlap = !(boxA.x + boxA.width <= boxB.x ||
                        boxB.x + boxB.width <= boxA.x ||
                        boxA.y + boxA.height <= boxB.y ||
                        boxB.y + boxB.height <= boxA.y);
                    expect(overlap).toBeFalsy();
                }
            }
        }
    }
}