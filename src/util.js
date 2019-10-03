const {exec} = require('child_process')

/** Promisified wraper for exec */
function _exec(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) return reject(err)
      resolve(stdout)
    })
  })
}

module.exports = {
    _exec
}
