'use strict'

module.exports = resources => {
  const paths = require('./schema/paths')
  const allPaths = []
  for (let r of resources) {
    allPaths.push(paths(r))
  }
  return Object.assign({}, ...allPaths)
}
