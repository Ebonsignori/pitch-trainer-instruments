const fs = require('fs')
const path = require('path')
const readline = require('readline')
const parseGitIgnore = require('parse-gitignore')
const Ignore = require('ignore')

const gitIgnored = parseGitIgnore(fs.readFileSync(path.join(__dirname, '..', '.gitignore')))
const ignore = Ignore().add(gitIgnored)

const ignoreList = [
  'utils',
  '.git',
]

function shouldIgnore (fileName) {
  if (ignoreList.includes(fileName)) {
    return true
  }
  if (ignore.ignores(fileName)) {
    return true
  }
  return false
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Generate instrument info logic
async function generateInstrumentInfo (instrumentDirPath) {
  const INSTRUMENT_DIRECTORY = path.join(__dirname, '..', 'instruments', instrumentDirPath)
  const INFO_JSON_PATH = path.join(INSTRUMENT_DIRECTORY, 'info.json')

  if (!fs.existsSync(INSTRUMENT_DIRECTORY)) {
    console.log(`Directory ${instrumentDirPath} does not exist in instruments directory.`)
    exit()
  }
  console.log(`${instrumentDirPath} found.`)
  const files = fs.readdirSync(INSTRUMENT_DIRECTORY)
  if (files.includes('info.json')) {
    await promptContinue(`Directory ${instrumentDirPath} already contains info.json`)
  }
  let extension
  const fileMap = {}

  // Map note names to note files to be consumed
  getNoteOpts().forEach(note => {
    fileMap[note] = files.find(fileName => {
      if (!fileName) {
        return null
      }
      const fileNamePart = fileName.split('.')[0].toLowerCase()
      const notePart = note.toLowerCase()
      if (fileName.includes('s')) {
        return fileNamePart === notePart.replace('#', 's')
      } else if (fileName.includes('v4')) {
        return fileNamePart.replace('v4', '') === notePart
      }
      return fileNamePart === notePart
    })
  })

  // Determin extension from valid note files
  Object.values(fileMap).forEach(async (fileName) => {
    if (!fileName) {
      return
    }
    const fileExt = fileName.split('.')[1]
    if (!extension) {
      extension = fileExt
    }
    if (extension !== fileExt) {
      await promptContinue(`File ${fileName} does not have the same extension as other audio files.`)
    }
  })

  // Write new info.json
  fs.writeFileSync(INFO_JSON_PATH, JSON.stringify({
    name: toTitleCase(instrumentDirPath),
    extension,
    fileMap,
  }, null, 4))
  console.log(`info.json writted to ${INFO_JSON_PATH}!`)
}

// - - -
// Helper Functions
// - - -
async function promptContinue (message, promptMessage = 'Continue? y/n: ') {
  console.log(message)
  return new Promise((resolve, reject) => {
    rl.question(promptMessage, (answer) => {
      console.log(answer)
      if (answer === 'y' || answer === 'yes') {
        return resolve(true)
      }
      exit(0)
    })
  })
}

function exit (statusCode) {
  console.log('Exiting...')
  process.exit(statusCode)
}

function toTitleCase (s) {
  return s
    .replace(/([^A-Z])([A-Z])/g, '$1 $2') // split cameCase
    // eslint-disable-next-line no-useless-escape
    .replace(/[_\-]+/g, ' ') // split snake_case and lisp-case
    .toLowerCase()
    .replace(/(^\w|\b\w)/g, function (m) { return m.toUpperCase() }) // title case words
    .replace(/\s+/g, ' ') // collapse repeated whitespace
    .replace(/^\s+|\s+$/, '') // remove leading/trailing whitespace
}

function isDirectory (path) {
  try {
    const stat = fs.lstatSync(path)
    return stat.isDirectory()
  } catch (e) {
    // lstatSync throws an error if path doesn't exist
    return false
  }
}

function getNoteOpts () {
  return [
    'C2',
    'C#2',
    'D2',
    'D#2',
    'E2',
    'F2',
    'F#2',
    'G2',
    'G#2',
    'A2',
    'A#2',
    'B2',
    'C3',
    'C#3',
    'D3',
    'D#3',
    'E3',
    'F3',
    'F#3',
    'G3',
    'G#3',
    'A3',
    'A#3',
    'B3',
    'C4',
    'C#4',
    'D4',
    'D#4',
    'E4',
    'F4',
    'F#4',
    'G4',
    'G#4',
    'A4',
    'A#4',
    'B4',
    'C5',
    'C#5',
    'D5',
    'D#5',
    'E5',
    'F5',
    'F#5',
    'G5',
    'G#5',
    'A5',
    'A#5',
    'B5',
    'C6'
  ]
}

module.exports = {
  generateInstrumentInfo,
  promptContinue,
  exit,
  isDirectory,
  toTitleCase,
  getNoteOpts,
  shouldIgnore,
}
