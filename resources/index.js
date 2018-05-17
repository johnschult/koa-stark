'use strict'

const compose = require('koa-compose')
const debug = require('debug')
const { forEach } = require('ramda')
const util = require('util')
const resourceRoutes = require('./resourceRoutes')
const watchStream = require('./watchStream')
const resourcesDebugLog = debug('koa-stark:init:resources')

module.exports = ({
  mongo = false,
  basePath = '',
  resources = [],
  prometheusClient
}) => {
  resourcesDebugLog('loading resources')

  // It would be uncommon not to use mongo, but it
  // is handy to disable it for testing
  if (mongo) {
    resourcesDebugLog(`connecting to mongo using: ${mongo}`)
    const mongoose = require('mongoose')
    mongoose.plugin(require('@meanie/mongoose-to-json'))
    mongoose.connect(mongo)
  }

  const sockets = []
  const routes = []

  forEach(resource => {
    resourcesDebugLog(`loading resource: ${util.inspect(resource)}`)
    const prefix = `${basePath}${resource.path}`
    if (resource.mongooseSchema) {
      routes.push(resourceRoutes(prefix, resource))
      sockets.push(watchStream(prefix, resource, prometheusClient))
    }
  })(resources)

  const histogram = new prometheusClient.Histogram({
    name: 'requests',
    help: 'used to keep track of requests',
    labelNames: ['method', 'statusCode', 'action', 'model']
  })

  const histogramMiddleware = async (ctx, next) => {
    ctx.end = histogram.startTimer({ method: ctx.method })
    await next()
    ctx.end({ action: ctx.action, statusCode: ctx.status })
  }

  return { routes: compose([histogramMiddleware, ...routes]), sockets }
}
