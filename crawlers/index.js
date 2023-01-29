const urlsUpdater = require("./urls-updater/vivareal");
const urlsProcessor = require("./urls-processor/vivareal");
const actions = ["update-urls", "process-urls"];
const action = actions[1];

(async () => {
    if (action === "update-urls") {
        await urlsUpdater();
    } else if (action === "process-urls") {
        await urlsProcessor();
    }
})();
