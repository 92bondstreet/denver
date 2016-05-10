const {exit} = process;
const {spawnSync} = require('child_process');
const {header, logger} = require('./logger');

/**
 * Checking (dev)Dependencies with ncu
 */
const ncu = () => {
  header('checking dependencies with ncu');
  if (spawnSync('ncu', ['-p'], {'stdio': 'inherit'}).status !== 0) {
    logger.error('[denver] unable to check dependencies with ncu');
    exit(1);
  }
  header('checking devDependencies with ncu');
  if (spawnSync('ncu', ['-d'], {'stdio': 'inherit'}).status !== 0) {
    logger.error('[denver] unable to check devDependencies with ncu');
    exit(1);
  }
};

/**
 * Highlight dependencies with
 * - newer version
 * - commit history between current version and HEAD
 */
module.exports = function lux () {
  ncu();
};
