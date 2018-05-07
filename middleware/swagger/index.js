'use strict'

module.exports = options => {
  if (!options.swagger) return []
  options.swagger.spec = require('./document')(options)
  return require('./swagger')(options)
}
