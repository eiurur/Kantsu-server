const fx = require('mkdir-recursive');
const fs = require('fs');
const path = require('path');
const bunyan = require('bunyan');

const CONSOLE_LOG_DIRECTORY = path.resolve('logs', 'consolelog');

module.exports = {
  activate: (env) => {
    switch ((env || process.env.NODE_ENV || '').toLowerCase()) {
      case 'production':
        fs.existsSync(CONSOLE_LOG_DIRECTORY) || fx.mkdirSync(CONSOLE_LOG_DIRECTORY);

        const log = bunyan.createLogger({
          name: 'console.log',
          streams: [
            {
              level: 'info',
              type: 'rotating-file',
              path: `${CONSOLE_LOG_DIRECTORY}/info.log`,
              period: '1d',
              count: 10000,
            },
            {
              level: 'error',
              type: 'rotating-file',
              path: `${CONSOLE_LOG_DIRECTORY}/error.log`,
              period: '1d',
              count: 10000,
            },
          ],
        });

        global.logger = log;
        break;
      case 'development':
        // // // Logger (console)
        // fs.existsSync(CONSOLE_LOG_DIRECTORY) || fx.mkdirSync(CONSOLE_LOG_DIRECTORY);

        // var log = bunyan.createLogger({
        //   name: 'console.log',
        //   streams: [
        //     {
        //       level: 'info',
        //       type: 'rotating-file',
        //       path: CONSOLE_LOG_DIRECTORY + '/info.log',
        //       period: '1d',
        //       count: 100000000
        //     },
        //     {
        //       level: 'error',
        //       type: 'rotating-file',
        //       path: CONSOLE_LOG_DIRECTORY + '/error.log',
        //       period: '1d',
        //       count: 100000000
        //     }]
        // });
        // global.logger = log;
        global.logger = {
          info: console.log,
        };
        break;
      default:
        global.logger = {
          info: console.log,
        };
    }
  },
};
