const io = require('fs')

const options = require('./options')

let thresholds = [
  {
    threshold: 120,
    text: 'Two minutes remaining',
  },
  {
    threshold: 60,
    text: '60 seconds remaining',
  },
  {
    threshold: 1,
    text: 'Your suffering is over',
  },
  {
    threshold: 10,
    text: 'ten',
  },
  {
    threshold: 5,
    text: 'five',
  },
  {
    threshold: 4,
    text: 'four',
  },
  {
    threshold: 3,
    text: 'three',
  },
  {
    threshold: 2,
    text: 'two',
  },
]

if (options.thresholds) {
  let data, parsed
  try {
    result = io.readFileSync(options.thresholds, 'UTF-8')
    parsed = JSON.parse(result)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
  if (!parsed.thresholds) {
    console.log('Bad input "thresholds" file format')
    process.exit(1)
  }
  thresholds = parsed.thresholds
}

module.exports = thresholds
