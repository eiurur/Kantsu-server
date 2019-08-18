const { EroterestController } = require('./controller');

module.exports = (app) => {
  app.get('/v1/eroterest/ping', EroterestController.pong);
  app.post('/v1/eroterest/movies', EroterestController.fetchMovieUrl);
};
