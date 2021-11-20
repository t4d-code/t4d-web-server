#! /usr/bin/env node

const { program } = require('commander')

const start = require('./commands/start');

const defaultPort = process.env.PORT ?? 4000;

program.option("--port <port>", "-p <port>", defaultPort);

program.parse();

options = program.opts();

const port = parseInt(options.port, 10);

start(port);
