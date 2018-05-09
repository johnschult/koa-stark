'use strict'
const debug = require('debug')('koa-stark:init')

const compose = require('koa-compose')

module.exports = (options, app) => {
  debug('loading koa-stark')
  const resources = require('./resources')(options, app)
  return compose([require('./middleware')(options), resources.routes()])
}
