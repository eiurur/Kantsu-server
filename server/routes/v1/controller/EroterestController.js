const path = require('path');

const { MovieLinkScraper, ExternalLinkScraper } = require(path.resolve('server', 'lib'));
const redisClient = require(path.resolve('server', 'models'));

module.exports = class EroterestController {
  // 個別ページから外部リンクを抜き出して返す
  static async fetchExternalUrl(url) {
    const scraper = new ExternalLinkScraper(url);
    const result = await scraper.exec();
    return result.link;
  }

  // 外部リンクから動画リンクを抜き出して返す
  static async fetchMovieUrl(req, res) {
    try {
      const eroterest_movie_page_pattern = /https:\/\/movie.eroterest.net\/page\/(\d+)\//;
      if (!eroterest_movie_page_pattern.test(req.body.url)) {
        throw new Error('invalid url');
      }

      // production環境ではキャッシングする
      if (process.env.NODE_ENV === 'production') {
        const reply = await redisClient.getAsync(req.body.url);
        const cachedMovie = JSON.parse(reply);
        if (cachedMovie !== null) {
          console.log('caching!');
          res.json({ movie: cachedMovie });
          return;
        }
      }

      const externalPageUrl = await EroterestController.fetchExternalUrl(req.body.url);
      const scraper = new MovieLinkScraper(externalPageUrl);
      const movie = await scraper.exec();
      redisClient.set(req.body.url, JSON.stringify(movie));

      res.json({ movie });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
};
