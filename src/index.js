const {spawn} = require('child_process')
const inquirer = require('inquirer')
const cliProgress = require('cli-progress')
const colors = require('colors/safe')

const {_exec, shuffleArray, nextIndex} = require('./util')
const options = require('./options')
const thresholds = require('./thresholds')

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
