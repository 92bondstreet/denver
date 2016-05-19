const {execSync} = require('child_process');

/**
 * Execute shell command in synchronous way
 *
 * @param  {String} command
 * @return {Promise}
 */
module.exports = function shell (command) {
  return new Promise((resolve, reject) => {
    try {
      return resolve(execSync(command, {'stdio': 'inherit'}));
    } catch (e) {
      return reject(e);
    }
  });
};
