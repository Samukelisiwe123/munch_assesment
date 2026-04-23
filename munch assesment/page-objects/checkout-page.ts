import { expect, Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    try {
      await expect(this.firstName).toBeVisible({ timeout: 5000 });
      await this.firstName.fill(firstName);
      await this.lastName.fill(lastName);
      await this.postalCode.fill(postalCode);
      console.log('Checkout customer details entered');
    } catch (error) {
      console.error('Error filling checkout customer details:', error);
      await this.page.screenshot({ path: 'checkout-fill-error.png' });
      throw error;
    }
  }

  async continueToOverview() {
    try {
      await expect(this.continueButton).toBeVisible({ timeout: 5000 });
      await this.continueButton.click();
      await expect(this.subtotalLabel).toBeVisible({ timeout: 5000 });
      console.log('Navigated to checkout overview page');
    } catch (error) {
      console.error('Error continuing to checkout overview:', error);
      await this.page.screenshot({ path: 'checkout-continue-error.png' });
      throw error;
    }
  }

  async verifySummary(expectedItemPrice: number) {
    try {
      const subtotalText = await this.subtotalLabel.textContent();
      const taxText = await this.taxLabel.textContent();
      const totalText = await this.totalLabel.textContent();

      const subtotal = Number(subtotalText?.replace('Item total: $', '') ?? NaN);
      const tax = Number(taxText?.replace('Tax: $', '') ?? NaN);
      const total = Number(totalText?.replace('Total: $', '') ?? NaN);

      if (Number.isNaN(subtotal) || Number.isNaN(tax) || Number.isNaN(total)) {
        throw new Error(`Unable to parse checkout summary values: subtotal=${subtotalText}, tax=${taxText}, total=${totalText}`);
      }

      expect(subtotal).toBe(expectedItemPrice);
      expect(total).toBeCloseTo(subtotal + tax, 2);
      console.log(`Checkout summary validated: subtotal=${subtotal}, tax=${tax}, total=${total}`);
    } catch (error) {
      console.error('Error verifying checkout summary:', error);
      await this.page.screenshot({ path: 'checkout-summary-error.png' });
      throw error;
    }
  }

  async completeCheckout() {
    try {
      await expect(this.finishButton).toBeVisible({ timeout: 5000 });
      await this.finishButton.click();
      await expect(this.completeHeader).toBeVisible({ timeout: 5000 });
      console.log('Checkout completed');
    } catch (error) {
      console.error('Error completing checkout:', error);
      await this.page.screenshot({ path: 'checkout-finish-error.png' });
      throw error;
    }
  }

  async verifySuccessMessage() {
    try {
      await expect(this.completeHeader).toHaveText('Thank you for your order!');
      console.log('Success message verified');
    } catch (error) {
      console.error('Error verifying checkout success message:', error);
      await this.page.screenshot({ path: 'checkout-success-error.png' });
      throw error;
    }
  }
}
