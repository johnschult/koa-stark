'use strict'

const debug = require('debug')('koa-stark:init')
const { forEach } = require('ramda')
const compose = require('koa-compose')

module.exports = (options = {}, app) => {
  debug('loading koa-stark')
  const { routes, sockets } = require('./resources')(options)
  debug('attaching sockets to app')
  forEach(s => s.attach(app))(sockets)
  return compose([require('./middleware')(options), routes])
}
