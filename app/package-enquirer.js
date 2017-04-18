'use strict'

const path = require('path')

const E = require('electron')

const menus = require('./main/menus')

const SINGLE_INSTANCE = true

const Logger = require('./common/logger').getLogger(__filename)

const PageURLPackageFile = `file://${path.join(__dirname, 'app.html')}`
const PageURLError = `file://${path.join(__dirname, 'error.html')}`

let OpenedFile

// main
function main () {
  console.log(`pid ${process.pid} launched with ${quotedJoined(process.argv.slice(1))}`)

  if (SINGLE_INSTANCE) {
    if (E.app.makeSingleInstance(onAnotherInstance)) {
      console.log(`pid ${process.pid} quitting because process already launched`)
      E.app.quit()
      return
    }
  }

  E.app.once('ready', onReady)
  E.app.on('open-file', onOpenFile)
  E.app.on('window-all-closed', quit)
}

// main processing, when ready
function onReady () {
  E.Menu.setApplicationMenu(menus.getAppMenu())

  let opened = false

  if (process.argv.length > 1) {
    const fileName = path.resolve(process.cwd(), process.argv[1])
    createWindow(PageURLPackageFile, fileName, {fileName: fileName})
    opened = true
  }

  if (OpenedFile) {
    const fileName = OpenedFile
    OpenedFile = null
    createWindow(PageURLPackageFile, fileName, {fileName: fileName})
    opened = true
  }

  if (opened) return

  createWindow(PageURLError, '', {fileName: null})
}

// called when app is run from any kind of launch
function onAnotherInstance (argv, cwd) {
  if (argv.length <= 1) return

  const fileName = path.resolve(cwd, argv[1])
  createWindow(PageURLPackageFile, fileName, {fileName: fileName})
}

// file selected on Mac
function onOpenFile (event, fileName) {
  event.preventDefault()

  if (E.app.isReady()) {
    createWindow(PageURLPackageFile, fileName, {fileName: fileName})
    return
  }

  OpenedFile = fileName
}

// create a new window
function createWindow (url, subtitle, args) {
  Logger.debug(`creating window for ${url} "${subtitle}" ${JSON.stringify(args)}`)

  const fileName = args.fileName

  if (subtitle !== '') subtitle = `${subtitle} - `

  if (fileName != null) E.app.addRecentDocument(fileName)

  const options = {
    title: `${subtitle}PackageEnquirer`,
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'renderer', 'preload.js')
    }
  }

  if (process.platform === 'linux') {
    options.icon = path.join(__dirname, 'web', 'images', 'icon.png')
  }

  let win = new E.BrowserWindow(options)
  win.loadURL(url)

  E.Menu.setApplicationMenu(menus.getAppMenu())

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
  E.app.quit()
  setTimeout(reallyQuit, 2000).unref()
}

// really, really quit
function reallyQuit () {
  console.log(`process ${process.pid} didn't seem to want to quit, quitting anyway`)
  process.exit(1)
}

// run main
main()
