const createListener = require('./express');
const createServer = require('./server');

(async () => {
  const listener = createListener();

  require('./routes/api')(listener);
  require('./routes/routes')(listener);

  const server = await createServer(listener);
  server.listen(listener.get('port'), () => {
    console.log(
      `Express HTTPS server listening on port ${listener.get('port')}`
    );
  });
})();
