'use strict'

exports.sendRPC = sendRPC
exports.registerProcedure = registerProcedure

const E = require('electron')

const Logger = require('../../lib/logger').getLogger(__filename)

const ChannelName = 'rpc-messages'
const Procedures = new Map()

// send an RPC (no callback!)
function sendRPC (browserWindow, procedureName, args) {
  browserWindow.contents.send(ChannelName, null, procedureName, args)
}

// register a new procedure
function registerProcedure (name, fn) {
  Procedures.set(name, fn)
}

// set up ipc listener to handle rpc requests
E.ipcMain.on(ChannelName, (event, requestId, procedureName, args) => {
  const procedure = Procedures.get(procedureName)

  if (procedure == null) {
    Logger.log(`request for unregistered procedure ${procedureName}`)
    const message = `unregistered procedure ${procedureName}`
    event.sender.send(ChannelName, requestId, { message: message })
    return
  }

  try {
    procedure(args, cb)
  } catch (err) {
    event.sender.send(ChannelName, requestId, { messsage: err.message })
  }

  // callback function constructed to send result back
  function cb (err, data) {
    if (err) {
      event.sender.send(ChannelName, requestId, { messsage: err.message })
      return
    }

    event.sender.send(ChannelName, requestId, null, data)
  }
})
