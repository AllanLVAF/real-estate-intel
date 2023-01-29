### Real Estate Intel
suite of services for real estate businesses aiming at providing market intel

### Crawlers

service which crawls market gathering data

ECR images containing puppeteer run as images with concurrency limited by our "gentlemen agreement" for civilized crawling (to not DDOS the websites.) I guess around 5~10 concurrency. Each website has its own images and concurrency, and each of the actions onto the website are wrapped around a method that waits ~5 seconds, also not to DDOS them.

Each of the images will be crawling the website and cataloging the offers. It may skip/drop offers which have been recently catalogued (no need to upsert), or which characteristics make it fall into a deny list (too small, too expensive, etc.)

For starters, this service will run locally
