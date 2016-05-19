const {logger} = require('../helper/logger');
const shell = require('../helper/shell');

/**
 * Output git log for given package and between 2 sha commits
 *
 * @param  {String} dir
 * @param  {String} package
 * @param  {String} sha1
 * @param  {String} sha2
 * @return {Promise}
 */
module.exports = function log (dir, package, sha1, sha2) {
  return shell(`git --no-pager -C ${dir} log --pretty="format:%C(yellow)%h %ad%Cred%d %Creset%s%Cblue [%cn]" --decorate --date=short v${sha1}..v${sha2} 2> /dev/null`)
    .catch(() => {
      logger.error(`[denver] unable to get log for ${package} between v${sha1}..v${sha2}`);
      return shell(`git --no-pager -C ${dir} log --pretty="format:%C(yellow)%h %ad%Cred%d %Creset%s%Cblue [%cn]" --decorate --date=short ${sha1}..${sha2} 2> /dev/null`);
    })
    .catch(() => {
      logger.error(`[denver] unable to get log for ${package} between ${sha1}..${sha2}`);
      return Promise.reject(false);
    });
};
