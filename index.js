const nn = require('node-notifier')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  {
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

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

const showReminder = (timeLeft, next) => {
  nn.notify({
    title: options.title,
    message: `Time left: ${timeLeft}s, next turn: ${next}`,
    timeout: 5
  })
}

const showChange = (names, index) => {
  nn.notify(
    {
      title: options.title,
      message: `Time's up. Next in line ${getNext(names, index)}`,
      timeout: 900,
      actions: 'OK'
    },
    (error, response, metadata) => {
      if (metadata.activationValue === 'OK') {
        const newIndex = (names[index + 1] && index + 1) || 0
        setTimer(names, newIndex)
      }
    }
  )
}

const setTimer = (names, index) => {
  const interval = options.interval
  setTimeout(() => {
    showReminder(60, getNext(names, index))
  }, 60 * (interval - 1) * 1000)
  setTimeout(() => {
    showChange(names, index)
  }, 60 * 1000)
}

const main = () => {
  const names = options.names
  if (options.random) {
    shuffleArray(names)
  }
  console.log('Started')
  nn.notify(
    {
      title: options.title,
      message: `${names[0]}. Ready to start?`,
      actions: 'Start',
      timeout: 900
    },
    (error, response, metadata) => {
      if (metadata.activationValue === 'Start') {
        setTimer(names, 1)
      }
    }
  )
}

main()
