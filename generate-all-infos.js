// Generates an info.json for each instrument in instruments folder
const path = require('path')
const fs = require('fs')
const { exit, isDirectory, generateInstrumentInfo, shouldIgnore } = require('./utils')

const INSTRUMENT_DIR_PATH = path.join(__dirname, 'instruments')

async function main () {
  console.log(`Running for ${INSTRUMENT_DIR_PATH}. Should contain folders of instruments.`)
  const files = fs.readdirSync(INSTRUMENT_DIR_PATH)

  const validInstruments = files.map((instrumentPath) => {
    if (!isDirectory(path.join(INSTRUMENT_DIR_PATH, instrumentPath))) {
      return null
    }
    if (shouldIgnore(instrumentPath)) {
      return null
    }
    return instrumentPath
  }).filter(x => x)

  for (const instrumentPath of validInstruments) {
    await generateInstrumentInfo(instrumentPath)
  }
  exit(0)
}

// Entry point
main()
