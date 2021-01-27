// Generates top-level instruments info.json of instruments in repo
const path = require('path')
const fs = require('fs')
const parseGitIgnore = require('parse-gitignore')
const Ignore = require('ignore')
const { isDirectory, promptContinue, exit, toTitleCase } = require('./utils')

const INSTRUMENT_DIR_PATH = path.join(__dirname, 'instruments')
const INFO_JSON_PATH = path.join(INSTRUMENT_DIR_PATH, 'info.json')

const GITHUB_USERNAME = 'ebonsignori'
const GITHUB_REPO_NAME = 'pitch-trainer-instruments'

const gitIgnored = parseGitIgnore(fs.readFileSync(path.join(__dirname, '.gitignore')))
const ignore = Ignore().add(gitIgnored)

const ignoreList = [
  'utils',
  '.git',
]

async function main () {
  console.log(`Running for ${INSTRUMENT_DIR_PATH}. Should contain folders of instruments.`)
  const files = fs.readdirSync(INSTRUMENT_DIR_PATH)
  if (files.includes('info.json')) {
    await promptContinue(`Directory ${INSTRUMENT_DIR_PATH} already contains info.json`)
  }

  const instrumentsMap = {}
  files.forEach((instrumentPath) => {
    if (!isDirectory(path.join(INSTRUMENT_DIR_PATH, instrumentPath))) {
      return null
    }
    if (ignoreList.includes(instrumentPath)) {
      return null
    }
    if (ignore.ignores(instrumentPath)) {
      return null
    }
    instrumentsMap[toTitleCase(instrumentPath)] = instrumentPath
  })

  // Write new info.json
  fs.writeFileSync(INFO_JSON_PATH, JSON.stringify({
    name: 'pitch-trainer-instruments',
    instruments: instrumentsMap,
    username: GITHUB_USERNAME,
    repo: GITHUB_REPO_NAME,
  }, null, 4))
  console.log(`info.json writted to ${INFO_JSON_PATH}!`)
  exit(0)
}

// Entry point
main()
