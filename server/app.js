const createListener = require('./express');
const createServer = require('./server');

/**
 * Application
 */
const listener = createListener();

/**
 * routes
 */
require('./routes/api')(listener);
require('./routes/routes')(listener);

/**
 * Server
 */
const server = createServer(listener);
server.listen(listener.get('port'), () => {
  logger.info(`Express HTTPS server listening on port ${listener.get('port')}`);
});
