'use strict'

exports.register = register

const rpc = require('./rpc')

const Procedures = [
  'GetPackageInfo'
]

function register () {
  for (let procedure of Procedures) {
    rpc.registerProcedure(procedure, require(`./${procedure}`).implementation)
  }
}
