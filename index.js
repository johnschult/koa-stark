'use strict'

const debug = require('debug')('koa-stark:init')
const { forEach } = require('ramda')
const compose = require('koa-compose')
const prometheusClient = require('prom-client')

module.exports = (options = {}, app) => {
  debug('loading koa-stark')
  prometheusClient.collectDefaultMetrics({ timeout: 5000 }) // Probe every 5th second.
  options['prometheusClient'] = prometheusClient
  const { routes, sockets } = require('./resources')(options)
  debug('attaching sockets to app')
  forEach(s => s.attach(app))(sockets)

  return compose([require('./middleware')(options), routes])
}
