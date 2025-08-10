import chromium from "npm:chrome-aws-lambda";

export async function fuzz() {
    let browser = null;
    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();
        await page.goto('https://example.com');
        const title = await page.title();
        return title;
    } catch (error) {
        console.log(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    } 
    return 'error###';
};