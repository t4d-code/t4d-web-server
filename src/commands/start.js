const chalk = require('chalk')

module.exports = async (port) => {
  
  await require('../app/index').start(port);

  chalk.blue("start web server on port 3000");

}