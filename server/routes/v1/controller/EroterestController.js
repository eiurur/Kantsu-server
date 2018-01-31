const path = require('path');

const { MovieLinkScraper } = require(path.resolve('server', 'lib'));

module.exports = class EroterestController {
  constructor() {}

  static async fetchMovieUrl(req, res) {
    const url = req.query.url;
    const scraper = new MovieLinkScraper(url);
    const movieUrls = await scraper.exec();
    console.log(movieUrls);
    res.json({ movieUrls });
  }
};
