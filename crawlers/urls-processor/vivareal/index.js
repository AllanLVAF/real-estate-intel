const path = require("path");
const crypto = require("crypto")
const puppeteer = require("puppeteer");
const { LocationClient, CreatePlaceIndexCommand, DeletePlaceIndexCommand, SearchPlaceIndexForTextCommand } = require("@aws-sdk/client-location");
const offersClient = require("../../../fabric/clients/offers");

const currentFolder = path.basename(__dirname);
const websiteID = currentFolder;

const locationClient = new LocationClient({
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
    }
});

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

        // Gets coordinates
        const IndexName = `property_${crypto.randomUUID()}`;

        await locationClient.send(new CreatePlaceIndexCommand({
            DataSource: "Here",
            IndexName,
        }));

        try {
            const command = new SearchPlaceIndexForTextCommand({
                IndexName,
                Text: data.address,
                MaxResults: 1,
                Language: "pt-BR",
                // FilterCountries: "BRA",
            });
            const response = await locationClient.send(command);
            const [lat, long] = response.Results[0].Place.Geometry.Point;
            data.coordinates = JSON.stringify([lat, long]);
        } catch (e) {
            console.log("error on getting/storing coordinates");
            console.log(e)
        }

        await locationClient.send(new DeletePlaceIndexCommand({
            IndexName,
        }));
    
        await offersClient.putOfferData(data);
    }

    console.log("No more data to crawl");
};
