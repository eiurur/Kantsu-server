const path = require('path');

const { MovieLinkScraper, ExternalLinkScraper } = require(path.resolve(
  'server',
  'lib'
));
const redisClient = require(path.resolve('server', 'models'));

const EROTEREST_MOVIE_PAGE_PATTERN =
  /https:\/\/movie.eroterest.net\/page\/(\d+)\//;

module.exports = class EroterestController {
  // 個別ページから外部リンクを抜き出して返す
  static async fetchExternalUrl(url) {
    const scraper = new ExternalLinkScraper(url);
    const result = await scraper.exec();
    return result.link;
  }

  static async pong(req, res) {
    res.json({ date: new Date() });
  }

  // 外部リンクから動画リンクを抜き出して返す
  static async fetchMovieUrl(req, res) {
    try {
      const { url } = req.body;
      if (!EROTEREST_MOVIE_PAGE_PATTERN.test(url)) {
        throw new Error('invalid url');
      }

      // production環境ではキャッシングする
      if (process.env.NODE_ENV === 'production') {
        const reply = await redisClient.getAsync(url);
        const cachedMovie = JSON.parse(reply);
        if (cachedMovie !== null) {
          console.log('caching!');
          res.json({ movie: cachedMovie });
          return;
        }
      }

      const externalPageUrl = await EroterestController.fetchExternalUrl(url);
      const scraper = new MovieLinkScraper(externalPageUrl);
      const movie = await scraper.exec();
      redisClient.set(url, JSON.stringify(movie));

      res.json({ movie });
    } catch (e) {
      console.log(e);
      res.status(400).send(e.message);
    }
  }
};
