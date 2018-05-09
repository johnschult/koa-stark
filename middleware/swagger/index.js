'use strict'

const debug = require('debug')('koa-stark:init:middleware:swagger')
const util = require('util')

module.exports = options => {
  debug(`swagger: ${util.inspect(options.swagger)}`)
  if (!options.swagger) return []
  options.swagger.spec = require('./document')(options)
  return require('./swagger')(options)
}
