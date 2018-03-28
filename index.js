const nn = require('node-notifier')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [{
    name: 'names',
    alias: 'n',
    type: String,
    multiple: true,
    defaultOption: true,
    defaultValue: ['me']
  },
  {
    name: 'interval',
    alias: 'i',
    type: Number,
    defaultValue: 6 // minutes
  },
  {
    name: 'random',
    alias: 'r',
    type: Boolean,
    defaultValue: false
  },
  {
    name: 'title',
    alias: 't',
    type: String,
    defaultValue: 'Lightning Coding'
  }
]

const options = commandLineArgs(optionDefinitions)

const getNext = (names, index) => names[index + 1] || names[0]

const showReminder = (timeLeft, next) => {
  nn.notify({
    title: options.title,
    message: `Time left: ${timeLeft}s, next turn: ${next}`,
    timeout: 5
  })
}

const showChange = (names, index) => {
  nn.notify({
    title: options.title,
    message: `Time's up. Next in line ${getNext(names, index)}`,
    timeout: 60,
    actions: 'OK'
  }, (error, response, metadata) => {
    console.log(response, metadata);
    const newIndex = (names[index + 1] && index + 1) || 0
    setTimer(names, index + 1)
  })
}

const setTimer = (names, index) => {
  const interval = options.interval
  setTimeout(() => {
    showReminder(60, getNext(names, index))
  }, 60 * (interval - 1))
  setTimeout(() => {
    showChange(names, index)
  }, 60)
}

const main = () => {
  const names = options.names
  if (options.random) {
    names.sort(() => .5 - Math.random())
  }
  console.log('Started')
  nn.notify({
    title: options.title,
    message: `${names[0]}. Ready to start?`,
    actions: 'Start',
    timeout: 60
  }, (error, response, metadata) => {
    console.log(response, metadata)
    setTimer(names, 1)
  })
}

main()
