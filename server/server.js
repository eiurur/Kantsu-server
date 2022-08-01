const pem = require('pem');
const util = require('util');
const createCertificate = util.promisify(pem.createCertificate);

module.exports = async (listener) => {
  try {
    if (process.env.USE_RENDER === 'true') {
      throw new Error('USE_RENDER is true');
    }
    const keys = await createCertificate({ days: 365, selfSigned: true });
    const httpsOptions = {
      key: keys.serviceKey,
      cert: keys.certificate,
    };
    const { createServer } = require('https');
    return createServer(httpsOptions, listener);
  } catch (e) {
    const { createServer } = require('http');
    return createServer(listener);
  }
};
