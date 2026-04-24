import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';
import { SortPage } from '../page-objects/sort-page';
import { CartPage } from '../page-objects/cart-page';
import { CheckoutPage } from '../page-objects/checkout-page';

test.describe.serial('Munch QA Tech Assessment Tests', () => {
  let loginPage: LoginPage;
  let sortPage: SortPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let sharedPage: any;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();
    loginPage = new LoginPage(sharedPage);
    sortPage = new SortPage(sharedPage);
    cartPage = new CartPage(sharedPage);
    checkoutPage = new CheckoutPage(sharedPage);
  });

  test.afterAll(async () => {
    await sharedPage.context().close();
  });

  test('should login successfully', async () => {
    await loginPage.login();
  });

  test('should show error with invalid login (Negative / Edge Case Tests)', async ({ page }) => {
    const invalidLoginPage = new LoginPage(page);
    await expect(invalidLoginPage.loginWithCredentials('bad_user', 'wrong_pass')).rejects.toThrow(/Epic sadface.*Username and password do not match/);
  });

  test('Product List & Sorting', async () => {
    
    await sortPage.sortByPriceLowToHigh();
  });
  
  test('Add & Remove Cart Items', async () => {
    // Add 3 items to the cart
    await cartPage.addItems(3);

    // Verify cart count = 3
    const countAfterAdd = await cartPage.getCartCount();
    console.log(`Cart count after adding: ${countAfterAdd}`);
    await expect(countAfterAdd).toBe(3);

    // Remove first item
    await cartPage.removeItemByIndex(0);

    // Verify cart count = 2
    const countAfterRemove = await cartPage.getCartCount();
    console.log(`Cart count after removing: ${countAfterRemove}`);
    await expect(countAfterRemove).toBe(2);

    // Open cart and verify cart page items
    await cartPage.openCart();
    const cartItems = await cartPage.getCartItemCount();
    console.log(`Items in cart page: ${cartItems}`);
    await expect(cartItems).toBe(2);
  });

  test('Checkout Workflow', async () => {
    await sharedPage.goto('https://www.saucedemo.com/');
    await loginPage.login();

    await cartPage.clearCart();

    const itemPriceText = await sharedPage.locator('.inventory_item .inventory_item_price').first().textContent();
    const itemPrice = Number(itemPriceText?.replace('$', '') ?? 0);

    await cartPage.addItems(1);
    await cartPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillCustomerInfo('Steve', 'Shongwe', '1234');
    await checkoutPage.continueToOverview();
    await checkoutPage.verifySummary(itemPrice);
    await checkoutPage.completeCheckout();
    await checkoutPage.verifySuccessMessage();
  });
});
