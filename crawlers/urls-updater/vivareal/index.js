const path = require("path")
const puppeteer = require("puppeteer");
const getEndpoint = require("./get-endpoint")
const offersClient = require("../../../fabric/clients/offers")

const currentFolder = path.basename(__dirname)
const websiteID = currentFolder
const website = require("../../websites.json")[websiteID];

module.exports = async () => {
    const endpoint = await getEndpoint(website)
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
    const url = `${website.baseUrl}${endpoint.path}`;
	await page.goto(url);

    const pages = [1, 2, 3];

    for (const p of pages) {
        await new Promise(r => setTimeout(r, 2500));
        const offerUrls = await page.$$eval('[data-type="property"] > div > article > a', el => el.map(link => link.href))
        console.log("Got offers " + offerUrls)
        console.log("Got offers amount " + offerUrls.length)
        await offersClient.putBatchOfferUrls({ websiteID, offerUrls });
        await page.$eval('[title="Próxima página"]', el => el.click())
        await new Promise(r => setTimeout(r, 5000));
    }

    await new Promise(r => setTimeout(r, 5000));

	await browser.close();
};
