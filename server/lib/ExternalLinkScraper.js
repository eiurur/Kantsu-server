const client = require('cheerio-httpcli');

module.exports = class ExternalLinkScraper {
  constructor(_url) {
    this.url = _url;
    this.link = null;
  }

  async exec() {
    this.link = await this.extract();
    return this;
  }

  async extract() {
    const result = await client.fetch(this.url);
    return result.$('.gotoBlog a').attr('href');
  }

  get() {
    return this.link;
  }
};
