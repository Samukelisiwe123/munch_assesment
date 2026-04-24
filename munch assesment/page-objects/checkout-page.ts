import { expect, Locator, Page } from '@playwright/test';

// CheckoutPage manages the checkout steps: entering customer info, reviewing order, and completing purchase
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
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Customer info form on checkout page
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    // Price and total info on order review page
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Fill in the customer name and address on the checkout form
  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    try {
      await expect(this.firstName).toBeVisible({ timeout: 5000 });
      await this.firstName.fill(firstName);
      await this.lastName.fill(lastName);
      await this.postalCode.fill(postalCode);
      console.log('Checkout customer details entered');
    } catch (error) {
      console.error('Error filling checkout customer details:', error);
      await this.page.screenshot({ path: 'screenshots/checkout-fill-error.png' });
      throw error;
    }
  }

  // Click continue to go to the order review page
  async continueToOverview() {
    try {
      await expect(this.continueButton).toBeVisible({ timeout: 5000 });
      await this.continueButton.click();
      await expect(this.subtotalLabel).toBeVisible({ timeout: 5000 });
      console.log('Navigated to checkout overview page');
    } catch (error) {
      console.error('Error continuing to checkout overview:', error);
      await this.page.screenshot({ path: 'screenshots/checkout-continue-error.png' });
      throw error;
    }
  }

  // Click the continue button on the checkout form
  async clickContinue() {
    try {
      await expect(this.continueButton).toBeVisible({ timeout: 5000 });
      await this.continueButton.click();
      console.log('Clicked continue on checkout info page');
    } catch (error) {
      console.error('Error clicking continue on checkout info page:', error);
      await this.page.screenshot({ path: 'screenshots/checkout-click-continue-error.png' });
      throw error;
    }
  }

  // Get the error message if the form has missing or bad information
  async getValidationError(): Promise<string> {
    try {
      await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
      return (await this.errorMessage.textContent())?.trim() ?? '';
    } catch (error) {
      console.error('Error reading checkout validation message:', error);
      throw error;
    }
  }

  async verifySummary(expectedItemPrice: number) {
    try {
      // Get the prices shown on the order review page
      const subtotalText = await this.subtotalLabel.textContent();
      const taxText = await this.taxLabel.textContent();
      const totalText = await this.totalLabel.textContent();

      const subtotal = Number(subtotalText?.replace('Item total: $', '') ?? NaN);
      const tax = Number(taxText?.replace('Tax: $', '') ?? NaN);
      const total = Number(totalText?.replace('Total: $', '') ?? NaN);

      if (Number.isNaN(subtotal) || Number.isNaN(tax) || Number.isNaN(total)) {
        throw new Error(`Unable to parse checkout summary values: subtotal=${subtotalText}, tax=${taxText}, total=${totalText}`);
      }

      // Check that the subtotal is correct and the total equals subtotal plus tax
      expect(subtotal).toBe(expectedItemPrice);
      expect(total).toBeCloseTo(subtotal + tax, 2);
      console.log(`Checkout summary validated: subtotal=${subtotal}, tax=${tax}, total=${total}`);
    } catch (error) {
      console.error('Error verifying checkout summary:', error);
      await this.page.screenshot({ path: 'screenshots/checkout-summary-error.png' });
      throw error;
    }
  }

  // Click the finish button to complete the purchase
  async completeCheckout() {
    try {
      await expect(this.finishButton).toBeVisible({ timeout: 5000 });
      await this.finishButton.click();
      await expect(this.completeHeader).toBeVisible({ timeout: 5000 });
      console.log('Checkout completed');
    } catch (error) {
      console.error('Error completing checkout:', error);
      await this.page.screenshot({ path: 'screenshots/checkout-finish-error.png' });
      throw error;
    }
  }

  // Check that the success message appears after purchase is done
  async verifySuccessMessage() {
    try {
      await expect(this.completeHeader).toHaveText('Thank you for your order!');
      console.log('Success message verified');
    } catch (error) {
      console.error('Error verifying checkout success message:', error);
      await this.page.screenshot({ path: 'screenshots/checkout-success-error.png' });
      throw error;
    }
  }
}
