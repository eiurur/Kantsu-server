const path = require('path');

const { MovieLinkScraper, ExternalLinkScraper } = require(path.resolve('server', 'lib'));

module.exports = class EroterestController {
  constructor() {}

  // 個別ページから外部リンクを抜き出して返す
  static async fetchExternalUrl(url) {
    const scraper = new ExternalLinkScraper(url);
    const result = await scraper.exec();
    return result.link;
  }

  // 外部リンクから動画リンクを抜き出して返す
  static async fetchMovieUrl(req, res) {
    try {
      // HACK:
      const url = req.query.url.includes('https://movie.eroterest.net/page')
        ? await this.fetchExternalUrl(req.query.url)
        : req.query.url;
      const scraper = new MovieLinkScraper(url);
      const result = await scraper.exec();
      console.log(result);
      res.json({ movie: result });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
};
