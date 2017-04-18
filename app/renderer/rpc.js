'use strict'

exports.sendRPC = sendRPC
exports.registerProcedure = registerProcedure

const E = require('electron')

const ChannelName = 'rpc-messages'
const Callbacks = new Map()
let RequestID = 0
const Procedures = new Map()

// register a new procedure
function registerProcedure (name, fn) {
  Procedures.set(name, fn)
}

// add handler for our channel
E.ipcRenderer.on(ChannelName, handleProcedureOrResponse)

// handle a response from the channel
function handleProcedureOrResponse (event, requestId, arg1, arg2) {
  // handle procedures
  if (requestId == null) {
    const procedureName = arg1
    const args = arg2
    const procedure = Procedures.get(procedureName)
    if (procedure == null) {
      throw new Error(`unregistered procedure ${procedureName}`)
    }
    procedure(args)
    return
  }

  const err = arg1
  const data = arg2

  // handle responses
  const cb = Callbacks.get(requestId)
  Callbacks.remove(requestId)

  if (cb == null) {
    console.log(`callback not found for requestId ${requestId}`)
    return
  }

  cb(err, data)
}

// send a request on the channel
function sendRPC (procedureName, args, cb) {
  RequestID++
  Callbacks.set(RequestID, cb)

  E.ipcRenderer.send(ChannelName, RequestID, procedureName, args)
}
