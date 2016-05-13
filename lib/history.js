const findVersions = require('find-versions');
const {header, logger, section} = require('./logger');
const ncu = require('npm-check-updates');
const {mapify} = require('es6-mapify');
const readPkgUp = require('read-pkg-up');
const path = require('path');
const promisify = require('es6-promisify');
const repository = require('./repository');
const shell = require('./shell');
const temp = require('temp');

temp.track();

const mkdir = promisify(temp.mkdir, temp);

/**
 * Get results of promise sequences
 *
 * @param {Array} tasks
 * @return {Array}
 */
const sequenceTasks = tasks => {
  const records = (results, value) => {
    results.push(value);
    return results;
  };
  const values = records.bind(null, []);

  return tasks.reduce((promise, task) => {
    return promise.then(task).then(values);
  }, Promise.resolve());
};

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
 * Output git log for given package and between 2 sha commits
 *
 * @param  {String} dir
 * @param  {String} package
 * @param  {String} sha1
 * @param  {String} sha2
 * @return {Promise}
 */
const log = (dir, package, sha1, sha2) => {
  return shell(`git --no-pager -C ${dir} log --pretty="format:%C(yellow)%h %ad%Cred%d %Creset%s%Cblue [%cn]" --decorate --date=short v${sha1}..v${sha2} 2> /dev/null`)
    .catch(() => {
      logger.error(`[denver] unable to get log for ${package} between v${sha1}..v${sha2}`);
      return shell(`git --no-pager -C ${dir} log --pretty="format:%C(yellow)%h %ad%Cred%d %Creset%s%Cblue [%cn]" --decorate --date=short ${sha1}..${sha2} 2> /dev/null`);
    })
    .catch(() => {
      logger.error(`[denver] unable to get log for ${package} between ${sha1}..${sha2}`);
      return Promise.reject('<===>');
    });
};

/**
 * Find the commits history
 *
 * @param  {String} dir
 * @param  {String} package
 * @param  {String} sha1
 * @param  {String} sha2
 */
const commits = (dir, package, sha1, sha2) => {
  const tempDir = path.join(dir, package);

  sha1 = findVersions(sha1)[0];
  sha2 = findVersions(sha2)[0];

  repository(package)
    .then(value => {
      section(`${package} ${sha1} → ${sha2}`);
      shell(`mkdir ${tempDir}`);
      shell(`git clone ${value} ${tempDir}`);
      log(tempDir, package, sha1, sha2)
        .catch(() => logger.warn(`[denver] check commits history on ${value}`));
    });
};

/**
 * Parse each (dependencies
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
  sequenceTasks([mkdir, jsonUpgraded, readPkgUp])
    .then(value => parse(...value));
};
