'use strict'

exports.loadPackageInfo = loadPackageInfo
exports.clearCaches = clearCaches

const url = require('url')
const lruCache = require('lru-cache')
const tinyJsonHttp = require('tiny-json-http')

// maximum number of package info objects to cache
const PackageInfoMax = 1000

// time to live of cached package info objects
const PackageInfoTTL = 1000 * 60 * 5 // 5 minutes

// cache of package info objects
const PackageInfoCache = lruCache({
  max: PackageInfoMax,
  maxAge: PackageInfoTTL
})

// clear all caches
function clearCaches () {
  PackageInfoCache.reset()
}

// return the package info object for a package
function loadPackageInfo (registryURL, packageName, cb) {
  if (registryURL == null) registryURL = 'https://registry.npmjs.org/'

  let packageInfo = PackageInfoCache.get(packageName)
  if (packageInfo != null) {
    return setImmediate(cb, null, packageInfo)
  }

  const packageUrl = url.resolve(registryURL, packageName)
  tinyJsonHttp.get({url: packageUrl}, (err, data) => {
    if (err) return cb(err)

    PackageInfoCache.set(packageName, packageInfo)
    return cb(null, data.body)
  })
}
