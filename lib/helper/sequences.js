/**
 * Get results of promise sequences
 *
 * @param {Array} tasks
 * @return {Array}
 */
module.exports = function sequences (tasks) {
  const records = (results, value) => {
    results.push(value);
    return results;
  };
  const values = records.bind(null, []);

  return tasks.reduce((promise, task) => {
    return promise.then(task).then(values);
  }, Promise.resolve());
};
