#!/usr/bin/env node
const lux = require('./lib/lux');

require('yargs')
  .usage('usage: $0 command')
  .command('lux', 'Highlight newer versions of package dependencies', () => lux())
  .demand(1)
  .strict()
  .help('help')
  .argv;
