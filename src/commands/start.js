const chalk = require('chalk')
const startWebServer = require('../app/index');

module.exports = async (options) => {
  chalk.blue(`start web server on port ${options.port}`);
  await startWebServer(options);
};