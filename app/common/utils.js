'use strict'

exports.projectPath = projectPath

const path = require('path')

const ProjectPath = path.dirname(__dirname)

// Return the path of a file relative to the project root if path provided.
// If path not provided, returns the project path itself.
function projectPath (aPath) {
  if (aPath == null) return ProjectPath

  return path.relative(ProjectPath, aPath)
}
