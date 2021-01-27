# Pitch-Trainer-Instruments

A collection of organized instrument samples with index files (`info.json`) mapping notes to sample files.

## Usage

Each instrument directory contains an `info.json` with available note mappings, the file extension of each note, and a display name of the samples. 

The top-level [instruments/info.json](instruments/info.json) contains a list of each of the instruments.

The `info.json`s in each directory were created using the following scripts:

- [generate-instrument-info.js](./generate-instrument-info.js)
  Generates `info.json` for passed instrument arg in that instrument's directory.
  e.g.
  ```
  node ./generate-instrument-info.js loud_and_proud_piano
  ```
- [generate-all-infos.js](./generate-all-infos.js)
  Generates each `info.json` for every instrument samples folder in the [instruments](./instruments) directory.
  e.g.
  ```
  node ./generate-all-infos.js
  ```
  You will need to manually  accept each prompt, or you can use a bash helper to auto-confirm, like
  ```
  yes | node ./generate-all-infos.js
  ```
- [generate-repo-info.js](./generate-repo-info.js)
  Generates `info.json` describing each instrument in the [instrument](./instruments) directory. Example can be viewed [here](./instruments/info.json)
  e.g.
  ```
  node ./generate-repo-info.js
  ```


## Credits

Samples originally forked from [ledlamp](https://github.com/ledlamp/piano-sounds)

Most of these sounds came from electrashave at http://files.meowbin.com/Sounds. GreatAndSoftPiano, HardAndToughPiano, and LoudAndProudPiano were obtained from Yoshify by FireController1847.
