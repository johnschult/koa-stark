'use strict'

const logger = require('koa-pino-logger')
const debug = require('debug')('koa-stark:init:middleware:logging')

module.exports = options => {
  debug(`koa-pino-logger enabled: ${options.logging}`)
  return options.logging ? [logger()] : []
}
