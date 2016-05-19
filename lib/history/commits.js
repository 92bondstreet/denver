const findVersions = require('find-versions');
const log = require('./log');
const {logger, section} = require('../helper/logger');
const path = require('path');
const repository = require('./repository');
const shell = require('../helper/shell');

/**
 * Find the commits history
 *
 * @param  {String} dir
 * @param  {String} package
 * @param  {String} sha1
 * @param  {String} sha2
 */
module.exports = function commits (dir, package, sha1, sha2) {
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
