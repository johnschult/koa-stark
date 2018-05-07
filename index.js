'use strict'

const compose = require('koa-compose')

module.exports = options => {
  const resources = require('./resources')(options)
  return compose([
    require('./middleware')(options),
    resources.routes(),
    resources.allowedMethods()
  ])
}
