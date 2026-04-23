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
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = this.page.locator('[data-test="username"]');
        this.passwordInput = this.page.locator('[data-test="password"]');
        this.loginButton = this.page.locator('[data-test="login-button"]');
        this.errorMessage = this.page.locator('[data-test="error"]');
    }

    async login() {
        return this.loginWithCredentials(USERNAME, PASSWORD);
    }

    async loginWithCredentials(username: string, password: string) {
        try {
            console.log('Navigating to the login page...');
            await this.page.goto(URL, {waitUntil: 'domcontentloaded'});

            await this.usernameInput.clear();
            await this.usernameInput.fill(username);
            console.log(`Entered username: ${username}`);

            await this.passwordInput.clear();
            await this.passwordInput.fill(password);
            console.log(`Entered password: ${password}`);

            await this.loginButton.click();
            console.log('Clicked the login button');

            // Wait for either success or error
            try {
                await Promise.race([
                    this.page.waitForURL('**/inventory.html', { timeout: 5000 }),
                    this.errorMessage.waitFor({ state: 'visible', timeout: 5000 })
                ]);
            } catch {
                // Ignore timeout here; we'll check the state below
            }

            // Take screenshot after login attempt
            await this.page.screenshot({ path: 'screenshots/login-attempt.png' });

            // Check if error message appeared
            if (await this.errorMessage.isVisible()) {
                const errorText = await this.errorMessage.textContent();
                throw new Error(`Login failed: ${errorText}`);
            }

            console.log('Login successful');
            return this;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    async getErrorMessage(): Promise<string> {
        await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
        return (await this.errorMessage.textContent())?.trim() ?? '';
    }
}

   