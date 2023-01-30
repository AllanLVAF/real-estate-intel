const db = require("../../database");

const TableName = "offers"

/**
 * Returns the current UNIX timestamp.
 *
 * @returns {Number}
 */
function unixTimestamp () {  
    return Math.floor(Date.now() / 1000)
}

module.exports = {
    putBatchOfferUrls: async function({ websiteID, offerUrls }) {
        console.log("just called putBatchOfferUrls with " + offerUrls.length + " urls")

        for (const url of offerUrls) {
            console.log("processing url " + url)

            // TODO: Make this get in batch and then the put in batch as well
            const { Item: preExisting } = await db.get({
                TableName,
                Key: { websiteID, url },
            })
            console.log(JSON.stringify(preExisting, null, 2))
            if (!!preExisting) {
                console.log("pre-existing exists. Skipping...");
                continue;
            }

            console.log("pre-existing did not exist. Putting...");
            await db.put({
                TableName,
                Item: { websiteID, url, lastCrawled: 0 },
            })
        }
        
    },

    getToCrawl: async function() {
        // const threshold = unixTimestamp() - (2 * 60 * 60) // 2h ago
        const threshold = unixTimestamp() - (2 * 60)
        const { Items: [item] } = await db.scan({
            TableName,
            FilterExpression: 'lastCrawled < :threshold',
            ExpressionAttributeValues: {
                ':threshold': threshold
            },
            // FIXME: This is still kinda broken, not behaving exactly as expected
            Limit: 100,
        })
        return item;
    },

    putOfferData: async function(data) {
        console.log("Putting offer data...");
        const now = unixTimestamp();
        await db.put({
            TableName,
            Item: { lastCrawled: now, ...data },
        })
    }
};
