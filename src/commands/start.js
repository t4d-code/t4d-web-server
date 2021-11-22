import chalk from 'chalk';
import startWebServer from '../app/index.js';

export default async (options) => {
  chalk.blue`started rest api server on port ${options.port} using ${options.databaseFileName}`;
  await startWebServer(options);
};