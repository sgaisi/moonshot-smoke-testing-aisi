import { test, expect } from '@playwright/test';
import { main_page_startup } from './common';
import dotenv from 'dotenv';
import path from 'path';

const __dirname: string = '.'

// Read from ".env" file.
dotenv.config({ path: path.resolve(__dirname, '.env') });

// ---------------------------------------------------------------------------------------------------------------------
// Test moonshot - Smoke Test
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Test case for verifying the startup page elements.
 * It navigates to the startup page and checks for the visibility of various elements.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */

test('Smoke Test', async ({ page }) => {

    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const URI: string | undefined = process.env.URI
    const TOKEN: string | undefined = process.env.TOKEN

    const ADDITIONAL_PARAMETERS: string | undefined = process.env.ADDITIONAL_PARAMETERS

    await page.setViewportSize({
        width: 1920,
        height: 1080,
    });

    await page.goto('http://127.0.0.1:3000/');

    // Check the main_page_startup pages
    await main_page_startup(page);

    // Create Endpoint
    await page.getByRole('listitem').nth(0).click();
    await page.getByRole('button', { name: 'Create New Endpoint' }).click();
    await expect(page.getByPlaceholder('Name of the model')).toBeVisible();
    await page.getByPlaceholder('Name of the model').click();
    await page.getByPlaceholder('Name of the model').fill(ENDPOINT_NAME);
    await page.locator('.aiv__input-container').click();
    await page.getByRole('option', { name: 'azure-openai-connector' }).click();
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill(URI!);
    await page.getByPlaceholder('Access token for the remote').click();
    await page.getByPlaceholder('Access token for the remote').fill(TOKEN!);
    await page.getByText('More Configs').click();
    await page.getByPlaceholder('Additional parameters').click();
    await page.getByPlaceholder('Additional parameters').fill(ADDITIONAL_PARAMETERS!);
    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // Benchmarking
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', { name: 'Start New Run' }).click();
    await page.getByRole('button', { name: 'Hard test sets for Common' }).click();
    await page.getByRole('button', { name: 'MLCommons AI Safety' }).click();
    await page.locator('.flex > .flex > svg').click();
    await page.getByRole('main').getByRole('img').nth(2).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.locator('div:nth-child(3) > .flex > svg').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill('Test ' + Math.floor(Math.random() * 1000000000));
    await page.getByPlaceholder('Number of prompts perrecipe.').click();
    await page.getByPlaceholder('Number of prompts perrecipe.').fill('1');
    await page.getByRole('button', { name: 'Run' }).click();
    await expect(page.getByRole('button', { name: 'View Report' })).toBeVisible({ timeout: 60000 })
    await page.getByRole('button', { name: 'View Report' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download Detailed Scoring JSON' }).click();
    const download = await downloadPromise;
    const download1Promise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download HTML Report' }).click();
    const download1 = await download1Promise;
    await page.locator('main').filter({ hasText: 'Showing results forazure-' }).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

    // Red Teaming
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', { name: 'Start New Session' }).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.locator('div:nth-child(2) > .flex > svg').click();
    await page.getByRole('heading', { name: 'Toxic Sentence Generator' }).click();
    await page.locator('div:nth-child(3) > .flex > svg').click();
    await page.getByPlaceholder('Give this session a unique').fill('Test ' + Math.floor(Math.random() * 1000000000));
    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Prompt Template' }).click();
    await page.locator('div').filter({ hasText: /^mmlu$/ }).click();
    await page.getByRole('button', { name: 'Use' }).click();
    await page.getByRole('button', { name: 'Context Strategy' }).click();
    await page.locator('div').filter({ hasText: /^Add Previous Prompt$/ }).first().click();
    await page.getByRole('button', { name: 'Use' }).click();
    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.getByRole('button', {name: /send/i}).click();
})