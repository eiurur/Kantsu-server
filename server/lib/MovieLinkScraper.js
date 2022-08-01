const path = require('path');
const url = require('url');
const client = require('cheerio-httpcli');

const { MOVIE_SERVER_URLS } = require(path.resolve('server', 'constants'));

module.exports = class MovieLinkScraper {
  constructor(_url) {
    this.url = _url;
    this.links = [];
  }

  async exec() {
    this.links = await this.extract();
    this.links = this.uniq(this.links);
    return this;
  }

  async extract() {
    const result = await client.fetch(this.url);
    return result
      .$('[href]')
      .filter(function (i, el) {
        try {
          const { hostname } = url.parse(result.$(this).attr('href'));
          return MOVIE_SERVER_URLS.includes(hostname);
        } catch (e) {
          return false;
        }
      })
      .map(function (i, el) {
        return {
          href: result.$(this).attr('href'),
        };
      })
      .get();
  }

  // scrape() {
  //   return Array.from(document.getElementsByTagName('a'));
  // }

  get() {
    return this.links;
  }

  uniq() {
    return this.links.filter(
      (link, index) =>
        this.links.findIndex(
          (l) => l.href === link.href && l.name === link.name
        ) === index
    );
  }
};
