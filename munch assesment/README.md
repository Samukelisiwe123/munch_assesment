# Munch Assessment

This repository contains a Playwright test project for the assessment.

## Project structure

- `playwright.config.ts` - Playwright configuration file.
- `tests/` - End-to-end test files.
- `pages/` - Page object models or page helper files.
- `playwright-report/` - Generated HTML report output.
- `screenshots/` - Captured screenshots from test runs.
- `test-results/` - Test run artifacts and results.

## Setup

1. Install dependencies:

```bash
npm install
```
68
2. Verify Playwright is installed by checking the package versions:

```bash
npx playwright --version
```

## Running tests

Run the full Playwright test suite with:

```bash
npx playwright test
```

## Viewing reports

After a test run, open the HTML report with:

```bash
npx playwright show-report
```

## Notes

- The project uses `@playwright/test` and Node.js CommonJS module type.
- If you need custom scripts, add them to `package.json` under `scripts`.
