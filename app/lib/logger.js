'use strict'

exports.getLogger = getLogger

const pkg = require('../package.json')
const utils = require('./utils')

const Debug = process.env.DEBUG != null || process.env.LOGLEVEL === 'debug'

const IsNode = typeof window === 'undefined'
const ActualLogger = IsNode ? getFileLogger() : console

// return a new logger
function getLogger (fileName) {
  return new Logger(fileName)
}

// logger object
class Logger {
  constructor (fileName) {
    this.fileName = utils.projectPath(fileName)
    this.endable = typeof ActualLogger.end === 'function'
  }

  log (message) {
    ActualLogger.log(`${getTime()} - ${this.fileName} - ${message}`)
  }

  debug (message) {
    if (!Debug) return
    this.log(message)
  }

  end () {
    if (!this.endable) return
    ActualLogger.end()
  }
}

// if in node, create a console-like object that logs to a file
function getFileLogger () {
  const fs = require('fs')
  const path = require('path')
  const mkdirp = require('mkdirp')
  const userhome = require('userhome')
  const logDir = userhome(`.${pkg.name}`)

  try {
    mkdirp.sync(logDir)
  } catch (err) {
    console.log(`unable to create dir ${logDir}: ${err}`)
    process.exit(1)
  }

  const logFile = path.join(logDir, 'log.txt')
  const oStream = fs.createWriteStream(logFile, {flags: 'a+'})

  class FileLogger {
    log (message) { oStream.write(`${message}\n`) }
  }

  return new FileLogger()
}

// get a printable version of the current time
function getTime () {
  let tzOffset = new Date().getTimezoneOffset() * 60 * 1000
  let date = new Date()
  date = new Date(date.getTime() - tzOffset)
  return date.toISOString().substr(5, 14).replace('T', ' ')
}
