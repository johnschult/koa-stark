'use strict'

const logger = require('koa-pino-logger')

module.exports = options => (options.logging ? [logger()] : [])
