import { test, expect } from '@playwright/test';
import { main_page_startup } from './common';
import {exec, execSync} from "node:child_process";
import { promisify } from 'util';

const execPromise = promisify(exec);
// ---------------------------------------------------------------------------------------------------------------------
// Test moonshot - init page
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Test case for verifying the startup page elements.
 * It navigates to the startup page and checks for the visibility of various elements.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page objects.
 */
test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
});

async function open_home_page_select_util_tab(page) {
  // Check if the left panel is correct and visible by looking for unique text within it (has the Added on)
  await page.goto('http://localhost:3000/');
  await main_page_startup(page);
  const linkTabButton = page.locator('#navContainer').getByRole('link').nth(4)
  await expect(linkTabButton).toBeVisible();
   await linkTabButton.click();
  // Assertion for redirecting to right page
  await expect(page.getByRole('heading', { name: 'moonshot utilities' })).toBeVisible();
}


test('test_util_page_view_prompt-templates', async ({ page }) => {
  await open_home_page_select_util_tab(page)
  await page.getByRole('button', { name: 'View Prompt Templates' }).click();
  await expect(page.locator('header').filter({ hasText: 'Prompt Templates' })).toBeVisible();
  await expect(page.locator('li').filter({ hasText: 'tamil-templatenewsclassificationThis template is used for Tamil News' })).toBeVisible();
});

test('test_util_page_view_context-strategies', async ({ page }) => {
  await open_home_page_select_util_tab(page)
  await expect(page.getByRole('heading', { name: 'moonshot utilities' })).toBeVisible();
  await page.getByRole('button', { name: 'View Context Strategies' }).click();
  await expect(page.getByRole('heading', { name: 'Context Strategies' })).toBeVisible();
  await expect(page.locator('h4')).toContainText('Add Previous Prompt');
  await expect(page.locator('body')).toContainText('This is a sample context strategy that adds in previous prompts to the current prompt. [Default: 5]');
});




