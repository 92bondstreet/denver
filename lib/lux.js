const history = require('./history');
const newer = require('./newer');

/**
 * Highlight dependencies with
 * - newer version
 * - commit history between current version and HEAD
 */
module.exports = function lux () {
  newer();
  history();
};
