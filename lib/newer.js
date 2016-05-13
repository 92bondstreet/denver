const {exit} = process;
const {header, logger} = require('./logger');
const shell = require('./shell');

/**
 * Checking (dev)Dependencies with ncu
 */
module.exports = function newer () {
  shell('rm -rf node_modules');
  header('checking newer dependencies version');
  shell('ncu -p')
    .catch(() => {
      logger.error('[denver] unable to check dependencies with npm-check-updates');
      exit(1);
    });
  header('checking newer devDependencies version');
  shell('ncu -d')
    .catch(() => {
      logger.error('[denver] unable to check devDependencies with npm-check-updates');
      exit(1);
    });
};
