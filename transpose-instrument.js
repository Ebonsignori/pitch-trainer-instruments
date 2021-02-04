// Generates info.json for a given folder passed as first arg to generate-info.js, e.g. `generate-info.js new_piano`
const fs = require('fs')
const path = require('path')
const { exit, promptContinue, shouldIgnore } = require('./utils')

const SAMPLES_DIR = process.argv[2]
const TRANSPOSE_AMOUNT = process.argv[3]

async function main () {
  const INSTRUMENT_DIRECTORY = path.join(__dirname, 'instruments', SAMPLES_DIR)
  if (!fs.existsSync(INSTRUMENT_DIRECTORY)) {
    console.log(`Directory ${INSTRUMENT_DIRECTORY} does not exist in instruments directory.`)
    exit()
  }
  const transposeAmount = parseInt(TRANSPOSE_AMOUNT, 10)
  const files = fs.readdirSync(INSTRUMENT_DIRECTORY)
  if (INSTRUMENT_DIRECTORY && Number.isInteger(transposeAmount)) {
    await promptContinue(`Transpose each file in ${INSTRUMENT_DIRECTORY} up/down by: ${TRANSPOSE_AMOUNT}?`)
  } else {
    console.log(`Transpose amount ${TRANSPOSE_AMOUNT} is not a valid integer.`)
    exit()
  }
  const getPath = (file) => path.join(INSTRUMENT_DIRECTORY, file)
  // If positive transpose, go through files backwards so they aren't named over each other
  if (transposeAmount > 0) {
    files.reverse()
  }
  files.forEach((fileName) => {
    if (fileName === 'info.json' || shouldIgnore(fileName)) {
      return
    }
    const octave = fileName.match(/\d+/)[0]
    const newFile = fileName.replace(octave, parseInt(octave, 10) + transposeAmount)
    console.log('old name: ', fileName)
    console.log('new name:', newFile)
    fs.renameSync(getPath(fileName), getPath(newFile))
  })
  console.log(`Files in ${INSTRUMENT_DIRECTORY} transposed by ${transposeAmount}`)
  exit(0)
}

// Entry point
main()
