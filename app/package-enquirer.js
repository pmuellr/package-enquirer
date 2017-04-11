'use strict'

const url = require('url')
const path = require('path')

const electron = require('electron')

const menus = require('./lib/menus')

const Logger = require('./lib/logger').getLogger(__filename)

const BrowserPageURL = url.format({
  protocol: 'file:',
  slashes: true,
  pathname: path.join(__dirname, 'web', 'app.html')
})

// main
function main () {
  Logger.debug(`pid ${process.pid} launched with ${quotedJoined(process.argv.slice(1))}`)

  if (electron.app.makeSingleInstance(openApp)) {
    Logger.debug(`pid ${process.pid} quitting because process already launched`)
    Logger.end()
    electron.app.quit()
    return
  }

  electron.app.on('ready', createWindow)
  electron.app.on('window-all-closed', quit)

  openApp(process.argv, process.cwd())
}

// called when app is run from any kind of launch
function openApp (argv, cwd) {
  cwd = path.resolve(cwd)
  if (argv.length <= 1) {
    Logger.debug('no file passed in')
    return
  }

  const file = path.resolve(cwd, argv[1])
  Logger.log(`pid ${process.pid} openApp with ${file}`)
}

// create a new window
function createWindow () {
  Logger.debug('creating window')

  const options = {
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'web', 'preload.js')
    }
  }

  if (process.platform === 'linux') {
    options.icon = path.join(__dirname, 'web', 'images', 'icon.png')
  }

  let win = new electron.BrowserWindow(options)
  win.loadURL(BrowserPageURL)

  electron.Menu.setApplicationMenu(menus.getAppMenu())

  win.on('closed', () => {
    win = null
  })
}

// given array of strings, return quoted joined version
function quotedJoined (array) {
  return array
    .map(el => `"${el}"`)
    .join(' ')
}

// quit the app
function quit () {
  Logger.debug(`process ${process.pid} quitting`)
  Logger.end()
  electron.app.quit()
  setTimeout(reallyQuit, 2000).unref()
}

// really, really quit
function reallyQuit () {
  console.log(`process ${process.pid} didn't seem to want to quit, quitting anyway`)
  process.exit(1)
}

// run main
main()
