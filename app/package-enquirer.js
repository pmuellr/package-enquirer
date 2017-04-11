'use strict'

const url = require('url')
const path = require('path')

const electron = require('electron')

const menus = require('./lib/menus')

const SINGLE_INSTANCE = true

const Logger = require('./lib/logger').getLogger(__filename)

const BrowserPageURL = url.format({
  protocol: 'file:',
  slashes: true,
  pathname: path.join(__dirname, 'web', 'app.html')
})

// main
function main () {
  console.log(`pid ${process.pid} launched with ${quotedJoined(process.argv.slice(1))}`)

  if (SINGLE_INSTANCE) {
    if (electron.app.makeSingleInstance(onAnotherInstance)) {
      console.log(`pid ${process.pid} quitting because process already launched`)
      electron.app.quit()
      return
    }
  }

  electron.app.once('ready', onReady)
  electron.app.on('open-file', onOpenFile)
  electron.app.on('window-all-closed', quit)
}

// main processing, when ready
function onReady () {
  electron.Menu.setApplicationMenu(menus.getAppMenu())

  if (process.argv.length <= 1) return

  const fileName = path.resolve(process.cwd(), process.argv[1])
  createWindow(fileName)
}

// called when app is run from any kind of launch
function onAnotherInstance (argv, cwd) {
  if (argv.length <= 1) return

  const fileName = path.resolve(cwd, argv[1])
  createWindow(fileName)
}

// file selected on Mac
function onOpenFile (event, fileName) {
  event.preventDefault()

  if (electron.app.isReady()) {
    createWindow(fileName)
    return
  }
  electron.app.once('ready', () => createWindow(fileName))
}

// create a new window
function createWindow (fileName) {
  Logger.debug(`creating window for ${fileName}`)

  electron.app.addRecentDocument(fileName)

  const options = {
    title: `${fileName} - PackageEnquirer`,
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
