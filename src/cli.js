#! /usr/bin/env node

const { EXP_20_MINS, EXP_1_DAY } = require('./app/constants');
const { program } = require('commander');

const start = require('./commands/start');

const defaultPort = process.env.PORT ?? 4000;
const defaultExpireAccessToken = process.env.EXPIRE_ACCESS_TOKEN ?? EXP_20_MINS;
const defaultExpireRefreshToken = process.env.EXPIRE_REFRESH_TOKEN ?? EXP_1_DAY;

program.option("--port <port>", "-p <port>", defaultPort);
program.option("--expireAccessToken <minutes>", "-a <minutes>", defaultExpireAccessToken);
program.option("--expireRefreshToken <minutes>", "-r <minutes>", defaultExpireRefreshToken);

program.parse();

commandLineOptions = program.opts();

const options = {
  port: parseInt(commandLineOptions.port, 10),
  expireAccessToken: parseInt(commandLineOptions.expireAccessToken, 10),
  expireRefreshToken: parseInt(commandLineOptions.expireRefreshToken, 10)
};

start(options);
