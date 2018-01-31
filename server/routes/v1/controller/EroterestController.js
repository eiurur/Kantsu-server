const path = require('path');

const { MovieLinkScraper } = require(path.resolve('server', 'lib'));

module.exports = class EroterestController {
  constructor() {}

  static async fetchMovieUrl(req, res) {
    try {
      const url = req.query.url;
      const scraper = new MovieLinkScraper(url);
      const movie = await scraper.exec();
      console.log(movie);
      res.json({ movie });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
};
