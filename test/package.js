'use strict'

const utils = require('./lib/utils')

const runTest = utils.createTestRunner(__filename)

const pkg = require('../app/package.json')

runTest(testPackageName)

// Check the package name.
function testPackageName (t) {
  t.deepEqual(pkg.name, 'package-enquirer', 'checking package name')
  t.end()
}
