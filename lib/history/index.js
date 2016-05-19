const commits = require('./commits');
const {header} = require('../helper/logger');
const ncu = require('npm-check-updates');
const {mapify} = require('es6-mapify');
const readPkgUp = require('read-pkg-up');
const promisify = require('es6-promisify');
const sequences = require('../helper/sequences');
const temp = require('temp');

temp.track();

const mkdir = promisify(temp.mkdir, temp);

/**
 * Output upgraded dependencies in json
 *
 * @return {Promise}
 */
const jsonUpgraded = () => {
  return ncu.run({
    'packageFile': 'package.json',
    'silent': true,
    'jsonUpgraded': true
  });
};

/**
 * Parse each dependencies
 *
 * @param  {String} dir
 * @param  {Object} upgraded
 * @param  {Object} packageJson
 */
const parse = (dir, upgraded, packageJson) => {
  header('commits history');
  const everything = Object.assign({}, packageJson.pkg.dependencies, packageJson.pkg.devDependencies);

  upgraded = mapify(upgraded);
  upgraded.forEach((semver, package) => {
    commits(dir, package, everything[package], semver);
  });
};

/**
 * Highlight commits history between current and newer versions of package dependencies
 */
module.exports = function history () {
  sequences([mkdir, jsonUpgraded, readPkgUp])
    .then(value => parse(...value));
};
