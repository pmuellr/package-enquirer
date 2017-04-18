'use strict'

exports.implementation = implementation

const tinyJsonHttp = require('tiny-json-http')

// get the package info for the specified package
function implementation (args, cb) {
  const packageName = args.packageName
  const opts = {
    url: `https://registry.npmjs.org/${packageName}`
  }

  tinyJsonHttp.get(opts, (err, result) => {
    if (err) return cb(err)
    cb(null, filterPackageInfo(result.headers, result.body))
  })
}

// filter down the package info bits
function filterPackageInfo (headers, body) {
  const result = {}

  result.name = body.name
  result.etag = headers.etag
  result.description = body.description
  result['dist-tags'] = body['dist-tags']
  result.maintainers = body.maintainers.map(m => m.name)
  result.time = body.time
  result.readme = body.readme
  result.versions = {}

  // fill in versions
  for (let version in body.versions) {
    const vbody = body.versions[version]
    const data = {}
    result.versions[version] = data

    data.dependencies = vbody.dependencies
    data.devDependencies = vbody.devDependencies
    data.peerDependencies = vbody.peerDependencies
    data.optionalDependencies = vbody.optionalDependencies
  }

  return result
}
