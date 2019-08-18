require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const compression = require('compression');

const env = process.env.NODE_ENV || 'development';

// application
module.exports = () => {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: '*' }));
  app.set('port', process.env.PORT);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(methodOverride());
  app.use(compression({ level: 9 }));

  if (env === 'development') {
    require('./config/development')(app);
  }

  if (env === 'production') {
    require('./config/production')(app);
  }

  return app;
};
