import {test, expect} from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';


const __dirname: string = '.'

// Read from ".env" file.
dotenv.config({path: path.resolve(__dirname, '.env')});

// ---------------------------------------------------------------------------------------------------------------------
// Test moonshot - Smoke Test
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Test case for verifying Benchamrk and Red Teaming Flow
 * Create Endpoint --> Benchmarking --> Red Teaming
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 */

async function open_home_page_select_util_tab(page, MOONSHOT_URL: string, MOOONSHOT_PORT_NUMBER: string) {
    // Check if the left panel is correct and visible by looking for unique text within it (has the Added on)
    await page.goto(MOONSHOT_URL! + ":" + MOOONSHOT_PORT_NUMBER!);
    const linkTabButton = page.locator('#navContainer').getByRole('link').nth(4)
    await expect(linkTabButton).toBeVisible();
    await linkTabButton.click();

    // Assertion for redirecting to right page
    await expect(page.getByRole('heading', {name: 'moonshot utilities'})).toBeVisible();
}


test('Moonshot UI Smoke Test', async ({page}) => {
    test.setTimeout(1200000); //set test timeout to 1 hour
    const ADDITIONAL_PARAMETERS: string | undefined = process.env.ADDITIONAL_PARAMETERS;
    const OPENAI_URI: string | undefined = process.env.OPENAI_URI;
    const OPENAI_TOKEN: string | undefined = process.env.OPENAI_TOKEN;
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const MOONSHOT_URL: string = process.env.MOONSHOT_URL || "http://localhost";
    const MOONSHOT_PORT_NUMBER: string = process.env.MOONSHOT_PORT_NUMBER || "3000";

    await page.setViewportSize({
        width: 1920,
        height: 1080,
    });

    console.log(MOONSHOT_URL! + ":" + MOONSHOT_PORT_NUMBER!)
    await page.goto(MOONSHOT_URL! + ":" + MOONSHOT_PORT_NUMBER!);

    // Create Endpoint
    console.log('Create Endpoint')
    await page.getByRole('listitem').nth(0).click();
    await page.getByRole('button', {name: 'Create New Endpoint'}).click();
    await page.getByPlaceholder('Name of the model').click();
    await page.getByPlaceholder('Name of the model').fill(ENDPOINT_NAME);
    await page.locator('.aiv__input-container').click();
    await page.getByRole('option', {name: 'openai-connector', exact: true}).click();
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill(OPENAI_URI!);
    await page.getByPlaceholder('Access token for the remote').click();
    await page.getByPlaceholder('Access token for the remote').fill(OPENAI_TOKEN!);
    await page.getByPlaceholder('Model of the model endpoint').click();
    await page.getByPlaceholder('Model of the model endpoint').fill('gpt-4o');
    await page.getByText('More Configs').click();
    await page.getByPlaceholder('Additional parameters').click();
    await page.getByPlaceholder('Additional parameters').fill('{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}');
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Save'}).click();

    // Benchmarking
    console.log('Benchmarking')
    await page.goto(MOONSHOT_URL! + ":" + MOONSHOT_PORT_NUMBER!);
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill('Test ' + Math.floor(Math.random() * 1000000000));
    await page.getByRole('button', {name: 'Run'}).click();
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1200000})
    await page.getByRole('button', {name: 'View Report'}).click();
    // const downloadPromise = page.waitForEvent('download');
    // await page.getByRole('button', {name: 'Download Detailed Scoring JSON'}).click();
    // const download = await downloadPromise;
    // const download1Promise = page.waitForEvent('download');
    // await page.getByRole('button', {name: 'Download HTML Report'}).click();
    // const download1 = await download1Promise;
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    console.log('1')
    await page.getByLabel('Next View').click();
    console.log('click next already')
    const html = await page.content()
    console.log(html)
    await expect(page.getByRole('heading', {name: 'Would you like to use any of'})).toBeVisible();
    console.log('pass page check')
    // Wait for a specific amount of time (in milliseconds)
    // await page.waitForTimeout(1200000); // Wait for 10 second
    // console.log('finish countdown')
    await page.locator('li').filter({ hasText: 'Toxic Sentence GeneratorThis' }).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill('Test ' + Math.floor(Math.random() * 1000000000));
    await page.getByRole('button', {name: 'Run'}).click();
    await page.getByRole('button', {name: 'Prompt Template'}).click();
    console.log('3')
    await page.locator('div').filter({hasText: /^mmlu$/}).click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByRole('button', {name: 'Context Strategy'}).click();
    console.log('4')
    await page.locator('div').filter({hasText: /^Add Previous Prompt$/}).first().click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByPlaceholder('Write a prompt...').click();
    console.log('5')
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.getByRole('button', {name: /send/i}).click();
    console.log('Ran red teaming and waiting to expect')
    // Locate the <h1> element with class "text-right" and text "You"
    const h1Element = page.locator('h1.text-right').nth(0);
    // Assert that the <h1> element with class "text-right" contains the text "You"
    await expect(h1Element).toBeVisible({timeout: 1200000});
    await expect(h1Element).toHaveText('Automated red teaming agent');
    // Locate the <h1> element with class "text-right" and text "You"
    const h2Element = page.locator('h1.text-left').nth(0);

    await expect(h2Element).toBeVisible({timeout: 1200000})
    await expect(h2Element).toHaveText('Response');

    // Utilities
    console.log('Utilities')
    await open_home_page_select_util_tab(page, MOONSHOT_URL!, MOONSHOT_PORT_NUMBER!)
    await page.getByRole('button', {name: 'View Prompt Templates'}).click();
    await expect(page.locator('header').filter({hasText: 'Prompt Templates'})).toBeVisible();
    await expect(page.locator('li').filter({hasText: 'tamil-templatenewsclassificationThis template is used for Tamil News'})).toBeVisible();

    await open_home_page_select_util_tab(page, MOONSHOT_URL!, MOONSHOT_PORT_NUMBER!)
    await expect(page.getByRole('heading', {name: 'moonshot utilities'})).toBeVisible();
    await page.getByRole('button', {name: 'View Context Strategies'}).click();
    await expect(page.getByRole('heading', {name: 'Context Strategies'})).toBeVisible();
    await expect(page.locator('h4').nth(0)).toContainText('Add Previous Prompt');
    await expect(page.locator('body')).toContainText('This is a sample context strategy that adds in previous prompts to the current prompt. [Default: 5]');
})