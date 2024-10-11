import {test, expect} from '@playwright/test';
import {main_page_startup} from './common';
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

// async function open_home_page_select_util_tab(page, MOONSHOT_URL: string, MOOONSHOT_PORT_NUMBER: string) {
//     // Check if the left panel is correct and visible by looking for unique text within it (has the Added on)
//     await page.goto(MOONSHOT_URL! + ":" + MOOONSHOT_PORT_NUMBER!);
//     await main_page_startup(page);
//     const linkTabButton = page.locator('#navContainer').getByRole('link').nth(4)
//     await expect(linkTabButton).toBeVisible();
//     await linkTabButton.click();
//
//     // Assertion for redirecting to right page
//     await expect(page.getByRole('heading', {name: 'moonshot utilities'})).toBeVisible();
// }

export async function create_endpoint_steps(page, name, uri, token, connectorType, maxCallPerSec, maxConcurr, otherParams, uriSkipCheck?: boolean) {
    await page.goto('http://localhost:3000/endpoints/new');
    await page.getByPlaceholder('Name of the model').click();
    await page.getByPlaceholder('Name of the model').fill(name);
    await page.locator('.aiv__input-container').click();
    await page.getByRole('option', {name: connectorType, exact: true}).click();
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill(uri);
    await page.getByPlaceholder('Access token for the remote').click();
    await page.getByPlaceholder('Access token for the remote').fill(token);
    await page.getByText('More Configs').click();
    if (maxCallPerSec != '') {
        await page.locator('.aiv__input-container').first().click();
        await page.getByRole('option', {name: maxCallPerSec}).click();
    }
    if (maxConcurr != '') {
        await page.locator('div:nth-child(2) > label > .css-fyq6mk-container > .aiv__control > .aiv__value-container > .aiv__input-container').click();
        await page.getByRole('option', {name: maxConcurr}).click();
    }
    await page.getByPlaceholder('Additional parameters').click();
    await page.getByPlaceholder('Additional parameters').fill(otherParams);
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Save'}).click();

    //Verify Expected redirection
    await expect.soft(page).toHaveURL(new RegExp('^http://localhost:3000/endpoints'));
    //Verify Endpoint Created Successfully
    await page.getByRole('link', {name: name}).click();
    await expect(page.locator('h3')).toHaveText(name, {timeout: 600000})
    if (uriSkipCheck == false) {
        if (uri != '') {
            await expect(page.getByText('uri', {exact: true})).toBeVisible();
        } else {
            await expect(page.getByText('Not set').first()).toBeVisible();
        }
    }

    if (maxCallPerSec != '') {
        await page.getByText(maxCallPerSec, {exact: true}).isVisible();
    } else {
        await expect(page.getByText('10', {exact: true})).toBeVisible();
    }
    if (maxConcurr != '') {
        await expect(page.getByText(maxConcurr, {exact: true})).toBeVisible();
    } else {
        await expect(page.getByText('1', {exact: true})).toBeVisible()
    }
    await expect(page.getByText(otherParams)).toBeVisible()
}


test('test_red_teaming_spinner_check', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.AZURE_OPENAI_URI, process.env.AZURE_OPENAI_TOKEN, 'azure-openai-connector', '2', '', '{\n      "timeout": 300,\n      "allow_retries": true,\n      "num_of_retries": 3,\n      "temperature": 0.5,\n      "model": "gpt-4o"\n  }', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('link', { name: 'red teaming', exact: true }).click();
    await page.getByRole('button', { name: 'Start New Session' }).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.locator('div:nth-child(2) > .flex > svg').click();
    await page.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await page.locator('div:nth-child(3) > .flex > svg').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Start'}).click();
    await page.getByRole('button', {name: 'Prompt Template'}).click();
    await page.locator('div').filter({hasText: /^mmlu$/}).click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByRole('button', {name: 'Context Strategy'}).click();
    await page.locator('div').filter({hasText: /^Add Previous Prompt$/}).first().click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.getByRole('button', {name: /send/i}).click();
    await expect(page.getByRole('status').locator('div').nth(1)).toBeVisible();

    // Create the locator for the element
    const elementLocator = page.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden'}); // 60 seconds


    // Assert that the element is no longer visible
    const isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();

    await expect(page.locator('div > li').nth(2)).toBeVisible();
    await expect(page.locator('div > li').nth(4)).toBeVisible();
    await expect(page.locator('div > li').nth(7)).toBeVisible();
    // Locate the <h1> element with class "text-right" and text "Automated red teaming agent"
    const h1Element = page.locator('h1.text-right').nth(0);

    // Assert that the <h1> element with class "text-right" contains the text "Automated red teaming agent"
    await expect(h1Element).toBeVisible({timeout: 1200000});
    await expect(h1Element).toHaveText('Automated red teaming agent');
    // Locate the <h1> element with class "text-left" and text "Response"
    const h2Element = page.locator('h1.text-left').nth(0);

    await expect(h2Element).toBeVisible({timeout: 1200000})
    await expect(h2Element).toHaveText('Response');

});
//
// test('Moonshot UI Smoke Test', async ({page}) => {
//
//     const ADDITIONAL_PARAMETERS: string | undefined = process.env.ADDITIONAL_PARAMETERS;
//     const AZURE_OPENAI_URI: string | undefined = process.env.AZURE_OPENAI_URI;
//     const AZURE_OPENAI_TOKEN: string | undefined = process.env.AZURE_OPENAI_TOKEN;
//     const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
//     const MOONSHOT_URL: string | undefined = process.env.MOONSHOT_URL;
//     const MOONSHOT_PORT_NUMBER: string | undefined = process.env.MOONSHOT_PORT_NUMBER;
//
//     await page.setViewportSize({
//         width: 1920,
//         height: 1080,
//     });
//
//     console.log(MOONSHOT_URL! + ":" + MOONSHOT_PORT_NUMBER!)
//     await page.goto(MOONSHOT_URL! + ":" + MOONSHOT_PORT_NUMBER!);
//
//
//     // Check the main_page_startup pages
//     await main_page_startup(page);
//
//     // Create Endpoint
//     console.log('Create Endpoint')
//     await page.getByRole('listitem').nth(0).click();
//     await page.getByRole('button', {name: 'Create New Endpoint'}).click();
//     await page.getByPlaceholder('Name of the model').click();
//     await page.getByPlaceholder('Name of the model').fill(ENDPOINT_NAME);
//     await page.locator('.aiv__input-container').click();
//     await page.getByRole('option', {name: 'azure-openai-connector'}).click();
//     await page.getByPlaceholder('URI of the remote model').click();
//     await page.getByPlaceholder('URI of the remote model').fill(AZURE_OPENAI_URI!);
//     await page.getByPlaceholder('Access token for the remote').click();
//     await page.getByPlaceholder('Access token for the remote').fill(AZURE_OPENAI_TOKEN!);
//     await page.getByText('More Configs').click();
//     await page.getByPlaceholder('Additional parameters').click();
//     await page.getByPlaceholder('Additional parameters').fill(ADDITIONAL_PARAMETERS!);
//     await page.getByRole('button', {name: 'OK'}).click();
//     await page.getByRole('button', {name: 'Save'}).click();
//
//     // Benchmarking
//     console.log('Benchmarking')
//     await page.getByRole('listitem').nth(1).click();
//     await page.getByRole('button', {name: 'Start New Run'}).click();
//     await page.getByRole('button', {name: 'Trust & Safety'}).click();
//     await page.getByLabel('Select common-risk-easy').check();
//     await page.getByRole('button', {name: 'OK'}).click();
//     await page.getByLabel('Next View').click();
//     console.log('reach here')
//     await page.getByLabel('Select ' + ENDPOINT_NAME).check();
//     console.log('reach here and click liao')
//     await page.getByLabel('Next View').click();
//     await page.getByPlaceholder('Give this session a unique').click();
//     await page.getByPlaceholder('Give this session a unique').fill('Test ' + Math.floor(Math.random() * 1000000000));
//     await page.getByPlaceholder('Number of prompts per recipe.').click();
//     await page.getByPlaceholder('Number of prompts per recipe.').fill('1');
//     await page.getByRole('button', {name: 'Run'}).click();
//     await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 60000})
//     await page.getByRole('button', {name: 'View Report'}).click();
//     const downloadPromise = page.waitForEvent('download');
//     await page.getByRole('button', {name: 'Download Detailed Scoring JSON'}).click();
//     const download = await downloadPromise;
//     const download1Promise = page.waitForEvent('download');
//     await page.getByRole('button', {name: 'Download HTML Report'}).click();
//     const download1 = await download1Promise;
//     await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
//     await page.getByText(/back to home/i).click()
//
//     // Red Teaming
//     console.log('Red Teaming')
//     await page.getByRole('listitem').nth(2).click();
//     await page.getByRole('button', {name: 'Start New Session'}).click();
//     await page.getByText(ENDPOINT_NAME!).click();
//     console.log('1')
//     await page.locator('div:nth-child(2) > .flex > svg').click();
//     console.log('click next already')
//     const html = await page.content()
//     console.log(html)
//     await expect(page.getByRole('heading', {name: 'Would you like to use any of'})).toBeVisible();
//     console.log('pass page check')
//     // Wait for a specific amount of time (in milliseconds)
//     // await page.waitForTimeout(1200000); // Wait for 10 second
//     // console.log('finish countdown')
//     await page.locator('li').filter({ hasText: 'Toxic Sentence GeneratorThis' }).click();
//     await page.locator('div:nth-child(3) > .flex > svg').click();
//     console.log('2')
//     await page.getByPlaceholder('Give this session a unique').fill('Test ' + Math.floor(Math.random() * 1000000000));
//     await page.getByRole('button', {name: 'Start'}).click();
//     await page.getByRole('button', {name: 'Prompt Template'}).click();
//     console.log('3')
//     await page.locator('div').filter({hasText: /^mmlu$/}).click();
//     await page.getByRole('button', {name: 'Use'}).click();
//     await page.getByRole('button', {name: 'Context Strategy'}).click();
//     console.log('4')
//     await page.locator('div').filter({hasText: /^Add Previous Prompt$/}).first().click();
//     await page.getByRole('button', {name: 'Use'}).click();
//     await page.getByPlaceholder('Write a prompt...').click();
//     console.log('5')
//     await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
//     await page.getByRole('button', {name: /send/i}).click();
//     console.log('Ran red teaming and waiting to expect')
//     // Locate the <h1> element with class "text-right" and text "You"
//     const h1Element = page.locator('h1.text-right').nth(0);
//     // Assert that the <h1> element with class "text-right" contains the text "You"
//     await expect(h1Element).toBeVisible({timeout: 1200000});
//     await expect(h1Element).toHaveText('Automated red teaming agent');
//     // Locate the <h1> element with class "text-right" and text "You"
//     const h2Element = page.locator('h1.text-left').nth(0);
//
//     await expect(h2Element).toBeVisible({timeout: 1200000})
//     await expect(h2Element).toHaveText('Response');
//
//     // Utilities
//     console.log('Utilities')
//     await open_home_page_select_util_tab(page, MOONSHOT_URL!, MOONSHOT_PORT_NUMBER!)
//     await page.getByRole('button', {name: 'View Prompt Templates'}).click();
//     await expect(page.locator('header').filter({hasText: 'Prompt Templates'})).toBeVisible();
//     await expect(page.locator('li').filter({hasText: 'tamil-templatenewsclassificationThis template is used for Tamil News'})).toBeVisible();
//
//     await open_home_page_select_util_tab(page, MOONSHOT_URL!, MOONSHOT_PORT_NUMBER!)
//     await expect(page.getByRole('heading', {name: 'moonshot utilities'})).toBeVisible();
//     await page.getByRole('button', {name: 'View Context Strategies'}).click();
//     await expect(page.getByRole('heading', {name: 'Context Strategies'})).toBeVisible();
//     await expect(page.locator('h4').nth(0)).toContainText('Add Previous Prompt');
//     await expect(page.locator('body')).toContainText('This is a sample context strategy that adds in previous prompts to the current prompt. [Default: 5]');
// })
//
// test.skip('CLI Test', async ({page}) => {
//
//     // const moonshot_cli = spawn('python3', ['-m', 'moonshot', 'cli', 'interactive'], { cwd:"/Users/benedict/Documents/GitHub/Moonshot-Projects/moonshot" })
//
//     // const moonshot_cli = spawn('/Users/benedict/Documents/GitHub/Moonshot-Projects/moonshot/',['-m', "moonshot cli", "\"run_recipe \"my new recipe runner\" \"['bbq','mmlu']\" \"['azure-openai-gpt4o']\" -n 2 -r 2 -s \"You are an intelligent AI\"\""]);
//     // const moonshot_cli = spawn('python3', ['-m', "moonshot cli \"run_recipe \"my new recipe runner\" \"['bbq','mmlu']\" \"['azure-openai-gpt4o']\" -n 2 -r 2 -s \"You are an intelligent AI\"\""], { cwd: "/Users/benedict/Documents/GitHub/Moonshot-Projects/"})
//
//     // child.on('message', function (m) {
//     //     console.log('Parent process received:', m);
//     // });
//     // moonshot_cli.stdout.on('data', (data) => {
//     //     console.log(`stdout: ${data}`);
//     // });
//
//     // moonshot_cli.stderr.on('data', (data) => {
//     //     console.error(`stderr: ${data}`);
//     // });
//
//     // moonshot_cli.on('message', function (m) {
//     //     console.log('Parent process received:', m);
//     // });
//
//     // moonshot_cli.on('close', (code) => {
//     //     console.log(`child process exited with code ${code}`);
//     // });
//
// })
