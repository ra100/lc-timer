const {
  spawn
} = require('child_process');
const inquirer = require('inquirer')
const commandLineArgs = require('command-line-args')
const cliProgress = require('cli-progress')
const colors = require('colors/safe')

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

const say = (text, config) => {
  if (config) {
    spawn('say', [config, text])
  }
  spawn('say', [text])
}

const options = commandLineArgs(optionDefinitions)

const nextIndex = (names, index) => index + 1 < names.length ? index + 1 : 0

const getNext = (names, index) => names[next(names, index)]

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const timesUp = (interval) => (...conf) => () => {
  clearInterval(interval)
  start(...conf)
}

const thresholds = [{
    threshold: 120,
    action: () => say('Two minutes remaining')
  },
  {
    threshold: 60,
    action: () => say('60 seconds remaining')
  },
  {
    threshold: 1,
    action: () => say('Your suffering is over')
  },
  {
    threshold: 10,
    action: () => say('ten')
  },
  {
    threshold: 5,
    action: () => say('five')
  },
  {
    threshold: 4,
    action: () => say('four')
  },
  {
    threshold: 3,
    action: () => say('three')
  },
  {
    threshold: 2,
    action: () => say('two')
  }
]

const checkThreshold = (thresholdProgress, secondsRemaining) => {
  thresholds.forEach((th, index) => {
    if (!thresholdProgress[index] && th.threshold >= secondsRemaining) {
      th.action()
      thresholdProgress[index] = true
    }
  })
  return thresholdProgress
}

const countdown = (names, index) => {
  say('Show me what you got!')
  const timestampStart = Date.now()
  const timestampEnd = timestampStart + (options.interval * 60 * 1000)
  const progressBar = new cliProgress.Bar({
    format: `${colors.yellow.bold(names[index])} [{bar}] {percentage}% | {value}/{total}s`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591'
  }, cliProgress.Presets.shades_grey);
  const totalSeconds = Math.floor((timestampEnd - timestampStart) / 1000)
  progressBar.start(totalSeconds, 0)

  let thresholdProgress = []

  const interval = setInterval(() => {
    const secondsRemaining = Math.floor((timestampEnd - Date.now()) / 1000)
    progressBar.update(totalSeconds - secondsRemaining)
    thresholdProgress = checkThreshold(thresholdProgress, secondsRemaining)
    if (secondsRemaining <= 0) {
      progressBar.stop()
      return timesUp(interval)(names, nextIndex(names, index))()
    }
  }, 100)
}

const start = (names = [], index = 0) => {
  console.log(`Next to go: ${colors.bold.cyan(names[index])}`)
  say(`Are you ready? ${names[index]}`)
  inquirer.prompt([{
    type: 'confirm',
    name: 'ready',
    message: 'Ready to start?',
    default: true
  }]).then(answers => {
    if (!answers.ready) {
      console.log('Nothing to do here.')
      say('I will remember this!!!')
      process.exit(0)
    }
    countdown(names, index)
  });
}

const main = () => {
  const names = options.names
  if (options.random) {
    shuffleArray(names)
  }
  console.log(`Order: ${colors.bold(names.join(', '))}`)
  start(names)
}

main()
