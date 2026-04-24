import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';
import { SortPage } from '../page-objects/sort-page';
import { CartPage } from '../page-objects/cart-page';
import { CheckoutPage } from '../page-objects/checkout-page';

// Complete test suite for SauceDemo site covering login, shopping, and checkout
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

  // Test that a user can log in with correct credentials
  test('should login successfully', async () => {
    // Log in with standard user account
    await loginPage.login();
  });

  // Test that login fails with an error message for bad credentials (Negative / Edge Case Tests)
  test('should show error with invalid login (Negative / Edge Case Tests)', async ({ page }) => {
    // Create a new login page instance for this test
    const invalidLoginPage = new LoginPage(page);
    // Try to log in with bad credentials and expect it to throw an error
    await expect(invalidLoginPage.loginWithCredentials('bad_user', 'wrong_pass')).rejects.toThrow(/Epic sadface.*Username and password do not match/);
  });

  // Test that products can be sorted by price from low to high
  test('Product List & Sorting', async () => {
    // Sort the products and verify they are in order from cheapest to most expensive
    await sortPage.sortByPriceLowToHigh();
  });
  
  // Test adding items to cart, removing items, and opening the cart page
  test('Add & Remove Cart Items', async () => {
    // Step 1: Add 3 items to the cart
    await cartPage.addItems(3);

    // Step 2: Verify cart count = 3
    const countAfterAdd = await cartPage.getCartCount();
    console.log(`Cart count after adding: ${countAfterAdd}`);
    await expect(countAfterAdd).toBe(3);

    // Step 3: Remove the first item
    await cartPage.removeItemByIndex(0);

    // Step 4: Verify cart count decreased to 2
    const countAfterRemove = await cartPage.getCartCount();
    console.log(`Cart count after removing: ${countAfterRemove}`);
    await expect(countAfterRemove).toBe(2);

    // Step 5: Open the cart page and count items
    await cartPage.openCart();
    const cartItems = await cartPage.getCartItemCount();
    console.log(`Items in cart page: ${cartItems}`);
    // Verify that the cart page also shows 2 items
    await expect(cartItems).toBe(2);
  });

  // Test the full checkout flow from login to order completion
  test('Checkout Workflow', async () => {
    // Step 1: Go to the homepage and log in
    await sharedPage.goto('https://www.saucedemo.com/');
    await loginPage.login();

    // Step 2: Clear any existing items in the cart
    await cartPage.clearCart();

    // Step 3: Get the price of the first item
    const itemPriceText = await sharedPage.locator('.inventory_item .inventory_item_price').first().textContent();
    const itemPrice = Number(itemPriceText?.replace('$', '') ?? 0);

    // Step 4: Add one item to cart and open it
    await cartPage.addItems(1);
    await cartPage.openCart();

    // Step 5: Click checkout
    await cartPage.checkout();

    // Step 6: Enter customer info on the checkout form
    await checkoutPage.fillCustomerInfo('Steve', 'Shongwe', '1234');

    // Step 7: Continue to the order review page
    await checkoutPage.continueToOverview();

    // Step 8: Verify the order summary shows correct prices
    await checkoutPage.verifySummary(itemPrice);

    // Step 9: Click finish to complete the purchase
    await checkoutPage.completeCheckout();

    // Step 10: Verify the success message appears
    await checkoutPage.verifySuccessMessage();
  });
});
