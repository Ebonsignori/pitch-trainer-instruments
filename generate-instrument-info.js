// Generates info.json for a given folder passed as first arg to generate-info.js, e.g. `generate-info.js new_piano`
const { exit, generateInstrumentInfo } = require('./utils')

const SAMPLES_DIR = process.argv[2]

async function main () {
  await generateInstrumentInfo(SAMPLES_DIR)
  exit(0)
}

// Entry point
main()
