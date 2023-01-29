const path = require("path");
const puppeteer = require("puppeteer");
const offersClient = require("../../../fabric/clients/offers");

const currentFolder = path.basename(__dirname);
const websiteID = currentFolder;
const website = require("../../websites.json")[websiteID];

const formatPrice = (price) => {
    // Removes anything but numbers
    return price.replace(/\D/g, '');
}

module.exports = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let toCrawl = {};
    while (toCrawl) {
        toCrawl = await offersClient.getToCrawl();

        if (!toCrawl) {
            console.log("No item to crawl");
            // return;
            continue;
        }
    
        const { url } = toCrawl;
        await page.goto(url);
    
        await new Promise(r => setTimeout(r, 2500));
    
        const data = { websiteID, url };
    
        // Gets price
        const [price] = await page.$$eval('[class="price__price-info js-price-sale"]', el => el.map(link => link.textContent));
        data.price = formatPrice(price);
        console.log(data.price);
    
        // Gets area
        const [area] = await page.$$eval('[title="Área"]', el => el.map(link => link.textContent));
        data.area = formatPrice(area);
        console.log(data.area);

        // Gets address
        const [address] = await page.$$eval('[class="title__address js-address"]', el => el.map(link => link.textContent));
        data.address = address;
        console.log(data.address);

        // TODO: Use https://developers.google.com/maps/documentation/geocoding/?csw=1 to convert address into coordinates
    
        await offersClient.putOfferData(data);
    }

    console.log("No more data to crawl");
};
