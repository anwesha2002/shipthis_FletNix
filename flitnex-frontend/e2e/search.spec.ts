import { test, expect } from '@playwright/test';

test('search functionality', async ({ page }) => {
  // Go to login page
  await page.goto('/login');

  // Login
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForURL('/');

  // Perform search
  await page.fill('input[placeholder="Search by title or cast..."]', 'matrix');

  // Wait for search results
  await page.waitForTimeout(300); // debounce time

  // Verify search results
  const showCards = page.locator('app-show-card');
  expect(await showCards.count()).toBeGreaterThan(0);

  // Click on first show
  await showCards.first().click();

  // Verify navigation to detail page
  expect(page.url()).toContain('/shows/');
});
