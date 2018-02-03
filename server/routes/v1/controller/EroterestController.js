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
      // const urls = decodeURIComponent(req.body.urls);
      console.log(req.body);

      const eroterest_movie_page_pattern = /https:\/\/movie.eroterest.net\/page\/(\d+)\//;
      const eroterestPageUrls = req.body.urls.filter(url => eroterest_movie_page_pattern.test(url));

      const movies = await Promise.all(eroterestPageUrls.map(async (url) => {
        if (!eroterest_movie_page_pattern.test(url)) {
          throw new Error(`${url} is invalid url`);
        }

        // production環境ではキャッシングする
        if (process.env.NODE_ENV === 'production') {
          const reply = await redisClient.getAsync(url);
          const cachedMovie = JSON.parse(reply);
          if (cachedMovie !== null) {
            return cachedMovie;
          }
        }

        const externalPageUrl = await EroterestController.fetchExternalUrl(url);
        const scraper = new MovieLinkScraper(externalPageUrl);
        const movie = await scraper.exec();
        redisClient.set(url, JSON.stringify(movie));

        return movie;
      }));

      res.json({ movies });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
};
