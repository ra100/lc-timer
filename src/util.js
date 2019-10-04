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

const nextIndex = (names, index) => (index + 1 < names.length ? index + 1 : 0)

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

module.exports = {
    _exec,
    shuffleArray,
    nextIndex
}
