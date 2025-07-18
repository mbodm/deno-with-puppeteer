import puppeteer from "puppeteer";

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));


  const result = await parseSite('recount');
  console.log(result);


  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto("https://news.ycombinator.com", {
  //   waitUntil: "networkidle2",
  // });
  // await page.pdf({ path: "hn.pdf", format: "A4" });

  // await browser.close();
}

async function parseSite(addonSlug: string): Promise<Result> {
  let browser;
  try {
    try {
      browser = await puppeteer.launch({ headless: true });
    }
    catch (e) {
      console.log(e);
      return createError('Puppeteer exception occurreed while launching browser.');
    }
    let page;
    try {
      page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'en' });
    }
    catch (e) {
      console.log(e);
      return createError('Puppeteer exception occurreed while getting page.');
    }
    const url = `http://www.curseforge.com/wow/addons/${addonSlug}`;
    try {
      const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      if (response === null) {
        return createError('Puppeteer response was null.');
      }
      const status = response.status();
      if (status !== 200) {
        if (status === 404) {
          return createError('It seems like the addon page does not exist (this usually happens when the given addon param is not a valid addon slug).');
        }
        return createError('Puppeteer reponse error occurred while going to page, but the response status code was not HTTP 404 (which is rather unexpected).');
      }
    }
    catch (e) {
      console.log(e);
      return createError('Puppeteer exception occurreed while going to page.');
    }
    let json;
    try {
      const element = await page.$('script#__NEXT_DATA__');
      if (!element) {
        return createError('Could not found JSON script element in page.')
      }
      const text = await page.evaluate(el => el.textContent, element);
      if (!text) {
        return createError('Found JSON script element in page, but the element was empty.');
      }
      json = text;
    }
    catch (e) {
      console.log(e);
      return createError('Puppeteer exception occurreed while evaluating page.');
    }
    return createSuccess(json);
  }
  finally {
    if (browser) {
      await browser.close();
    }
  }
}

type Result = {
  success: boolean,
  result: object | null,
  error: string
}


function createError(error: string): Result {
  return {
    success: false,
    result: null,
    error
  };
}

export function createSuccess(result: object): Result {
  return {
    success: true,
    result,
    error: ''
  };
}