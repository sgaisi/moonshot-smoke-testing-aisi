import { test, expect } from '@playwright/test';
import { main_page_startup } from './common';

// ---------------------------------------------------------------------------------------------------------------------
// Test moonshot - init page
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Test case for verifying the startup page elements.
 * It navigates to the startup page and checks for the visibility of various elements.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
test('test_main_start_page', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');

  // Check the main_page_startup pages
  await main_page_startup(page);
});

// ---------------------------------------------------------------------------------------------------------------------
// Test moonshot - clicking on the moonshot logo
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Test case for clicking the AIVerify Moonshot Logo.
 * It navigates to the startup page, clicks on the logo, and then verifies that all
 * expected elements are still visible on the page after the click.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
test('test_main_click_moonshot_logo', async ({ page }) => {
  // Navigate to the startup page
  await page.goto('http://127.0.0.1:3000/');
  
  // Click on the AIVerify Moonshot Logo
  await page.getByRole('img', { name: 'AIVerify Moonshot Logo' }).click();

  // Verify that all expected elements are visible on the page
  await main_page_startup(page);
});

// ---------------------------------------------------------------------------------------------------------------------
// Test moonshot - clicking on the bell icon
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Test case for toggling the visibility of the moonshot bell notification box.
 * It navigates to the startup page, clicks on the moonshot bell to open the notification box,
 * verifies that the notification box with the correct text is visible, and then clicks the bell again
 * to close the notification box and verify that it is hidden.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
test('test_main_click_moonshot_bell', async ({ page }) => {
  // Navigate to the startup page
  await page.goto('http://127.0.0.1:3000/');
  
  // Click on the moonshot bell to open the notification box
  await page.getByRole('banner').locator('path').first().click();

  // Verify that the notification box appears with the text 'Benchmark Run Status'
  await expect(page.locator('section').filter({ hasText: 'Benchmark Run Status' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Benchmark Run Status' })).toBeVisible();
  
  // Check that the main_page_startup page elements are still visible
  await main_page_startup(page);

  // Click on the moonshot bell to close the notification box
  await page.getByRole('banner').locator('svg').click();
  
  // Verify that the notification box is hidden
  await expect(page.locator('section').filter({ hasText: 'Benchmark Run Status' })).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Benchmark Run Status' })).toBeHidden();
  
  // Check that the main_page_startup page elements are still visible after closing the notification box
  await main_page_startup(page);
});

// ---------------------------------------------------------------------------------------------------------------------
// Test moonshot - randomly click on empty spaces in the page
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Test case for random clicking on various elements of the startup page.
 * It navigates to the startup page, performs clicks on different elements including a div with specific text,
 * the banner, a figure with a specific name, and a navigation container. After the clicks, it verifies that
 * all expected elements are still visible on the page.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */
test('test_main_random_clicking', async ({ page }) => {
  // Navigate to the startup page
  await page.goto('http://127.0.0.1:3000/');

  // Click on a div with specific text
  await page.locator('div').filter({ hasText: 'Focus on what\'s important,' }).first().click();
  
  // Click on the banner
  await page.getByRole('banner').click();

  // Verify that the main_page_startup page elements are still visible
  await main_page_startup(page);
});