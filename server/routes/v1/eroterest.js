const { EroterestController } = require('./controller');

module.exports = (app) => {
  app.post('/v1/eroterest/movies', EroterestController.fetchMovieUrl);
};
