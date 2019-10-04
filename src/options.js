const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  {
    name: 'names',
    alias: 'n',
    type: String,
    multiple: true,
    defaultOption: true,
    defaultValue: ['me'],
  },
  {
    name: 'interval',
    alias: 'i',
    type: Number,
    defaultValue: 6, // minutes
  },
  {
    name: 'random',
    alias: 'r',
    type: Boolean,
    defaultValue: false,
  },
  {
    name: 'title',
    alias: 't',
    type: String,
    defaultValue: 'Lightning Coding',
  },
  {
    name: 'voice',
    alias: 'v',
    type: String,
    defaultValue: null,
  },
  {
    name: 'thresholds',
    alias: 'l',
    type: String,
    defaultValue: null,
  },
]

const options = commandLineArgs(optionDefinitions)

module.exports = options
