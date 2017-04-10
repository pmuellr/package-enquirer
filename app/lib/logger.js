'use strict'

exports.getLogger = getLogger

const utils = require('./utils')

const Debug = process.env.DEBUG != null || process.env.LOGLEVEL === 'debug'

// return a new logger
function getLogger (fileName) {
  return new Logger(fileName)
}

// logger object
class Logger {
  constructor (fileName) {
    this.fileName = utils.projectPath(fileName)
  }

  log (message) {
    console.log(`${getTime()} - ${this.fileName} - ${message}`)
  }

  debug (message) {
    if (!Debug) return
    this.log(message)
  }
}

// get a printable version of the current time
function getTime () {
  let tzOffset = new Date().getTimezoneOffset() * 60 * 1000
  let date = new Date()
  date = new Date(date.getTime() - tzOffset)
  return date.toISOString().substr(5, 14).replace('T', ' ')
}
