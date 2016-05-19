const boxen = require('boxen');
const chalk = require('chalk');
const winston = require('winston');

/**
 * Colorized logger
 *
 * @return {Logger}
 */
module.exports.logger = new winston.Logger ({
  'transports': [
    new winston.transports.Console({
      'colorize': 'all'
    })
  ]
});

/**
 * Display header
 *
 * @param  {String} title
 * @return {Function}
 */
module.exports.header = function header (title) {
  /*eslint-disable no-console*/
  console.log(`\n\n${boxen(chalk.blue.bold(title), {
    'padding': 1,
    'margin': 1,
    'borderColor': 'yellow'})}\n`);
  /*eslint-enable no-console*/
};

module.exports.section = function section (title) {
  /*eslint-disable no-console*/
  console.log(`\n\n${boxen(chalk.yellow(title), {
    'borderColor': 'yellow'})}\n`);
  /*eslint-enable no-console*/
};
