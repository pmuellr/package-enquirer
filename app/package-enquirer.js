'use strict'

const url = require('url')
const path = require('path')

const electron = require('electron')

const browserPageURL = url.format({
  protocol: 'file:',
  slashes: true,
  pathname: path.join(__dirname, 'web', 'index.html')
})

electron.app.on('ready', createWindow)
electron.app.on('window-all-closed', quit)

function quit () {
  electron.app.quit()
}

function createWindow () {
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
  win.loadURL(browserPageURL)

  win.on('closed', () => {
    win = null
  })

  win.on('show', () => {
    win.webContents.openDevTools()
  })
}
