'use strict'

const compose = require('koa-compose')

module.exports = (options, app) => {
  const resources = require('./resources')(options, app)
  return compose([require('./middleware')(options), resources.routes()])
}
