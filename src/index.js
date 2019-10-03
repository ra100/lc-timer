const {spawn} = require('child_process')
const inquirer = require('inquirer')
const commandLineArgs = require('command-line-args')
const cliProgress = require('cli-progress')
const colors = require('colors/safe')
const io = require('fs')

const {_exec} = require('./util')

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

let voice // Chosen voice

const say = async (text, config) => {
  const params = []
  if (options.voice) {
    if (!voice) {
      if (options.voice.toLowerCase() !== 'random') {
        voice = options.voice
      } else {
        const result = await _exec("say -v ? | awk '{ print $1 }'").catch(
          err => {
            console.log(err)
            process.exit(1)
          }
        )
        if (!result) {
          console.log('The "say" voices list is empty')
          process.exit(1)
        }
        const voicesList = result.split(/\n/g)
        voice = voicesList[parseInt(Math.random() * (voicesList.length - 2))]
      }
    }
    params.push('-v', voice)
  }
  if (config) {
    params.push(config)
  }
  params.push(text)
  spawn('say', params)
}

const nextIndex = (names, index) => (index + 1 < names.length ? index + 1 : 0)

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const timesUp = interval => (...conf) => () => {
  clearInterval(interval)
  start(...conf)
}

const checkThreshold = (thresholdProgress, secondsRemaining) => {
  thresholds.forEach((th, index) => {
    if (!thresholdProgress[index] && th.threshold >= secondsRemaining) {
      say(th.text)
      thresholdProgress[index] = true
    }
  })
  return thresholdProgress
}

const countdown = (names, index) => {
  say('Show me what you got!')
  const timestampStart = Date.now()
  const timestampEnd = timestampStart + options.interval * 60 * 1000
  const progressBar = new cliProgress.Bar(
    {
      format: `${colors.yellow.bold(
        names[index]
      )} [{bar}] {percentage}% | {value}/{total}s`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
    },
    cliProgress.Presets.shades_grey
  )
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
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'ready',
        message: 'Ready to start?',
        default: true,
      },
    ])
    .then(answers => {
      if (!answers.ready) {
        console.log('Nothing to do here.')
        say('I will remember this!!!')
        process.exit(0)
      }
      countdown(names, index)
    })
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
