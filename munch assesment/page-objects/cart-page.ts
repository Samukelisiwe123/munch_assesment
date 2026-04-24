import { expect, Locator, Page } from '@playwright/test';

// CartPage handles all shopping cart actions like adding, removing, and checking out items
export class CartPage {
    readonly page: Page;
    readonly inventoryItems: Locator;
    readonly cartItems: Locator;
    readonly badge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.locator('.inventory_item');
        this.cartItems = page.locator('.cart_item');
        this.badge = page.locator('.shopping_cart_badge');
    }

    // Add a certain number of products to the cart
    async addItems(count: number) {
        try {
            await expect(this.inventoryItems.first()).toBeVisible({ timeout: 5000 });
            const available = await this.inventoryItems.count();

            if (count > available) {
                throw new Error(`Requested ${count} items, but only ${available} are available`);
            }

            for (let i = 0; i < count; i++) {
                const item = this.inventoryItems.nth(i);
                const name = await item.locator('[data-test="inventory-item-name"]').textContent();
                console.log(`Adding item: ${name}`);
                await item.locator('button').click();
            }

            await expect(this.badge).toHaveText(String(count));
        } catch (error) {
            console.error('Error adding items to cart:', error);
            await this.page.screenshot({ path: 'screenshots/cart-add-error.png' });
            throw error;
        }
    }

    // Remove an item from the product list by its position
    async removeItemByIndex(index: number) {
        try {
            const count = await this.inventoryItems.count();
            if (index < 0 || index >= count) {
                throw new Error(`Invalid remove index: ${index}. Available items: ${count}`);
            }

            const item = this.inventoryItems.nth(index);
            await expect(item).toBeVisible({ timeout: 5000 });

            const name = await item.locator('[data-test="inventory-item-name"]').textContent();
            console.log(`Removing item: ${name}`);
            await item.locator('button:has-text("Remove")').click();
        } catch (error) {
            console.error('Error removing item from cart:', error);
            await this.page.screenshot({ path: 'screenshots/cart-remove-error.png' });
            throw error;
        }
    }

    // Get the number of items shown in the cart badge
    async getCartCount(): Promise<number> {
        try {
            if (!await this.badge.isVisible()) {
                return 0;
            }
            const text = await this.badge.textContent();
            const value = Number(text);
            if (Number.isNaN(value)) {
                throw new Error(`Unexpected cart badge text: ${text}`);
            }
            return value;
        } catch (error) {
            console.error('Error reading cart count:', error);
            throw error;
        }
    }

    // Click the cart button to go to the cart page
    async openCart() {
        try {
            await expect(this.page.locator('.shopping_cart_link')).toBeVisible({ timeout: 5000 });
            await this.page.click('.shopping_cart_link');
        } catch (error) {
            console.error('Error opening cart:', error);
            await this.page.screenshot({ path: 'screenshots/cart-open-error.png' });
            throw error;
        }
    }

    // Click the checkout button from the cart page
    async checkout() {
        try {
            await expect(this.page.locator('[data-test="checkout"]')).toBeVisible({ timeout: 5000 });
            await this.page.click('[data-test="checkout"]');
        } catch (error) {
            console.error('Error clicking checkout:', error);
            await this.page.screenshot({ path: 'screenshots/cart-checkout-error.png' });
            throw error;
        }
    }

    // Remove all items from the cart by clicking the Remove button on each
    async clearCart() {
        try {
            let removeButtons = this.page.locator('.inventory_item button:has-text("Remove")');
            let count = await removeButtons.count();

            while (count > 0) {
                await removeButtons.first().click();
                removeButtons = this.page.locator('.inventory_item button:has-text("Remove")');
                count = await removeButtons.count();
            }

            console.log('Cleared existing cart items');
        } catch (error) {
            console.error('Error clearing cart:', error);
            await this.page.screenshot({ path: 'screenshots/cart-clear-error.png' });
            throw error;
        }
    }

    // Count how many items are on the cart page
    async getCartItemCount(): Promise<number> {
        try {
            await expect(this.cartItems.first()).toBeVisible({ timeout: 5000 });
            return await this.cartItems.count();
        } catch (error) {
            console.error('Error counting cart items:', error);
            throw error;
        }
    }
}






