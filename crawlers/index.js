require('dotenv').config()
const urlsUpdater = require("./urls-updater/vivareal");
const urlsProcessor = require("./urls-processor/vivareal");
const action = process.env.action;

(async () => {
    if (action === "update-urls") {
        await urlsUpdater();
    } else if (action === "process-urls") {
        await urlsProcessor();
    }
})();
