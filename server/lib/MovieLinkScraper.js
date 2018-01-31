const path = require('path');
const url = require('url');
const client = require('cheerio-httpcli');

const { MOVIE_SEARVE_URLS } = require(path.resolve('server', 'constants'));

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
      .$('a')
      .filter(function (i, el) {
        try {
          return MOVIE_SEARVE_URLS.includes(url.parse(result.$(this).attr('href')).hostname);
        } catch (e) {
          return false;
        }
      })
      .map(function (i, el) {
        return {
          href: result.$(this).attr('href'),
          title: result.$(this).attr('title'),
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
    return this.links.filter((link, index) =>
      this.links.findIndex(l => l.href === link.href && l.name === link.name) === index);
  }
};