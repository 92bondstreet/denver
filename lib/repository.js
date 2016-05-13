const packageJson = require('package-json');
const getPkgRepo = require('get-pkg-repo');

module.exports = function repository (package) {
  return packageJson(package, 'latest')
  .then(json => {
    return getPkgRepo(json).browse();
  });
};
