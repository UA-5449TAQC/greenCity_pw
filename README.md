# GreenCity Playwright Tests

End-to-end UI tests for GreenCity using Playwright Test.

## Overview

This repository contains browser-based automated tests for:

- Basic page/title validation for GreenCity
- Login modal visibility and input checks

Tests are configured to run across multiple browsers:

- Chromium

## Tech Stack

- Node.js
- Playwright Test
- TypeScript test files

## Project Structure

```text
.
|-- playwright.config.ts
|-- tests/
|   |-- example.spec.ts
|   `-- shopping_cart.spec.ts
|-- playwright-report/
`-- test-results/
```

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm

## Installation

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run tests in a specific file:

```bash
npx playwright test tests/shopping_cart.spec.ts
```

Run with a specific browser project:

```bash
npx playwright test --project=chromium
```

Run in headed mode (if needed):

```bash
npx playwright test --headed
```

## Test Reports

Playwright HTML report is generated after execution.

Open the latest report:

```bash
npx playwright show-report
```

Artifacts from failed tests are stored in test output folders, including screenshots and traces when enabled.

## Current Configuration Highlights

- Base URL: https://www.greencity.cx.ua
- Test directory: tests
- Reporter: html
- Fully parallel: enabled
- Retries on CI: enabled

Configuration file:

- playwright.config.ts

## Common Troubleshooting

- Browser not installed:
	run npx playwright install
- Tests fail due to slow loading:
	increase timeout in playwright.config.ts
- Flaky UI selectors:
	prefer semantic locators (role, label, placeholder) and wait for stable states

## Useful Commands

```bash
# Run with UI mode
npx playwright test --ui

# Debug a single test step by step
npx playwright test --debug

# Generate Playwright code snippets interactively
npx playwright codegen https://www.greencity.cx.ua
```