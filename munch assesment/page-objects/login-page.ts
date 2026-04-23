import {expect, Locator, Page} from '@playwright/test';

// SauceDemo test credentials
const URL = 'https://www.saucedemo.com/';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;      

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = this.page.locator('[data-test="username"]');
        this.passwordInput = this.page.locator('[data-test="password"]');
        this.loginButton = this.page.locator('[data-test="login-button"]');
    }

    async login() {
        try {
            console.log('Navigating to the login page...');
            await this.page.goto(URL, {waitUntil: 'domcontentloaded'});

            // Clear and fill username
            await this.usernameInput.clear();
            await this.usernameInput.fill(USERNAME);
            console.log(`Entered username: ${USERNAME}`);

            // Clear and fill password
            await this.passwordInput.clear();
            await this.passwordInput.fill(PASSWORD);
            console.log(`Entered password: ${PASSWORD}`);

            await this.loginButton.click();
            console.log('Clicked the login button');

            await expect(this.page.getByText('Swag Labs')).toBeVisible();
            console.log('Login successful, navigated to the next page');


            const screenshot = await this.page.screenshot({ path: 'login-success.png' });
            console.log('Screenshot taken: login-success.png');
        }
        catch (error) {
            console.error('Error during login:', error);
            throw error; // Rethrow the error to ensure the test fails
        }
    }
}

   