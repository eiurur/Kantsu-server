const { EroterestController } = require('./controller');

module.exports = (app) => {
  app.get('/v1/eroterest/movies', (req, res) => EroterestController.fetchMovieUrl(req, res));
};
