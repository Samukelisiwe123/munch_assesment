import { expect, Locator, Page } from "@playwright/test";

export class SortPage {
    readonly page: Page;
    readonly sortDropdown: Locator;
    readonly productTitles: Locator;
    readonly productPrices: Locator;        
    constructor(page: Page) {
        this.page = page;
        this.sortDropdown = this.page.locator('[data-test="product_sort_container"]');
        this.productTitles = this.page.locator('.inventory_item_name');
        this.productPrices = this.page.locator('.inventory_item_price');
    }   
    async sortByPriceLowToHigh() {
        // Select "Price (low to high)"
            await this.page.selectOption('.product_sort_container', 'lohi');
        
            // Get product prices
            const priceTexts = await this.page
              .locator('[data-test="inventory-item-price"]')
              .allTextContents();
        
            const prices = priceTexts.map((p: string) => Number(p.replace('$', '')));
        
            // Verify sorting
            const sortedPrices = [...prices].sort((a, b) => a - b);
            expect(prices).toEqual(sortedPrices);
        
            // Get titles
            const titleTexts = await this.page
              .locator('[data-test="inventory-item-name"]')
              .allTextContents();
        
            console.log('Product titles:', titleTexts);
            console.log('Product prices:', prices);
        
            // Assert title + price correctness
            expect(titleTexts.length).toBe(prices.length);
        
            // Example check: Verifying that the first item is the cheapest
            expect(prices[0]).toBe(Math.min(...prices));
    }
}
    