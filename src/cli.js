#! /usr/bin/env node

import { EXP_20_MINS, EXP_1_DAY } from './app/constants.js';
import { program } from 'commander';

import start from './commands/start.js';

const defaultPort = process.env.PORT ?? 4000;
const defaultDatabaseFileName = process.env.DB_FILE_NAME ?? 'db.json';
const defaultExpireAccessToken = process.env.EXPIRE_ACCESS_TOKEN ?? EXP_20_MINS;
const defaultExpireRefreshToken = process.env.EXPIRE_REFRESH_TOKEN ?? EXP_1_DAY;

program.option("--port <port>", "-p <port>", defaultPort);
program.option("--databaseFileName <filename>", "-d <filename>", defaultDatabaseFileName);
program.option("--expireAccessToken <seconds>", "-a <seconds>", defaultExpireAccessToken);
program.option("--expireRefreshToken <seconds>", "-r <seconds>", defaultExpireRefreshToken);

program.parse();

const commandLineOptions = program.opts();

const options = {
  port: parseInt(commandLineOptions.port, 10),
  databaseFileName: commandLineOptions.databaseFileName,
  expireAccessToken: parseInt(commandLineOptions.expireAccessToken, 10),
  expireRefreshToken: parseInt(commandLineOptions.expireRefreshToken, 10)
};

start(options);
