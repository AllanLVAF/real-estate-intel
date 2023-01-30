module.exports = async (website) => {
    // this may evolve into a method that fetches the DB to know what is the current distribution of crawlers per endpoint to decide which one to take. For now it just returns SP
    return website.endpoints[0];
}