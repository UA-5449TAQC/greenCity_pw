import { expect, Locator, Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

export class EventCard extends BaseComponent {
    private title: Locator;
    private status: Locator;
    private date: Locator;
    private time: Locator;
    private location: Locator;
    private image: Locator;
    private organizername: Locator;
    private organizeravatar: Locator;
    private joinButton: Locator;

    constructor(page: Page, root: Locator) {
        super(page, root);
        this.title = this.root.locator('.event-title p');
        this.status = this.root.locator('.event-status');
        this.image = this.root.locator('.event-image');
        this.date = this.root.locator('.date-container .date');
        this.time = this.root.locator('.date-container .time');
        this.location = this.root.locator('.date-container:has(> span.place) p');
        this.organizername = this.root.locator('.author p');
        this.organizeravatar = this.root.locator('.author-image');
        this.joinButton = this.root.getByText('Join event');
    }

    async getTitle(): Promise<string> {
        return this.title.innerText();
    }

    async getStatus(): Promise<string> {
        return this.status.innerText();
    }

    async getDate(): Promise<string> {
        return this.date.innerText();
    }

    async getTime(): Promise<string> {
        return this.time.innerText();
    }

    async getLocation(): Promise<string> {
        return this.location.innerText();
    }

    async getOrganizerName(): Promise<string> {
        return this.organizername.innerText();
    }

    async getOrganizerAvatarSrc(): Promise<string> {
        const src = await this.organizeravatar.getAttribute('src');
        return src || '';  // Return empty string if null
    }

    async getJoinButton(): Promise<Locator> {
        return this.joinButton;
    }

    async assertVisible(): Promise<void> {
        await expect(this.root).toBeVisible();
    }

    async assertDefaultImage(): Promise<boolean> {
        await expect(this.image).toBeVisible();

        const src = await this.image.getAttribute('src');
        return src === 'assets/img/habits/default-habit-image.png';
    }

    async assertUploadedImage(): Promise<boolean> {
        await expect(this.image).toBeVisible();

        const src = await this.image.getAttribute('src');
        return src !== 'assets/img/habits/default-habit-image.png';
    }

    async assertTitleTextOverflow(): Promise<void> {
        await expect(this.title).toHaveCSS('text-overflow', 'ellipsis');
    }

    async assertDateTimeFormat(locale: string): Promise<void> {
        const timeText = await this.getDate() + ' ' + await this.getTime();
        const dateTimeRegexEN = /^[A-Za-z]+\s\d{1,2},\s\d{4}\s\d{1,2}:\d{2}\s(AM|PM)$/;
        const dateTimeRegexUA = /^\d{1,2}\s[а-я]{3,4}\.\s\d{4}\s р\.\s\d{1,2}:\d{2}$/;
        if (locale === 'en') {
            expect(timeText).toMatch(dateTimeRegexEN);
        } else if (locale === 'uk') {
            expect(timeText).toMatch(dateTimeRegexUA);
        }
        console.log(`Valid date format: ${timeText}`);
    }

    async assertJoinButtonVisible(): Promise<void> {
        await expect(this.joinButton).toBeVisible();
    }

    async assertNoUIBreaks(): Promise<void> {
        await expect(this.title).toBeVisible();
        await expect(this.status).toBeVisible();
        await expect(this.date).toBeVisible();
        await expect(this.time).toBeVisible();
        await expect(this.location).toBeVisible();
        await expect(this.image).toBeVisible();
        await expect(this.organizername).toBeVisible();
        await expect(this.organizeravatar).toBeVisible();
        await expect(this.joinButton).toBeVisible();
    }

    async getCardHeight(): Promise<number> {
        const box = await this.root.boundingBox();
        return box ? box.height : 0;
    }

    async getBoundingBox(): Promise<{ x: number; y: number; width: number; height: number } | null> {
        return this.root.boundingBox();
    }
}