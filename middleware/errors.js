'use strict'

const debug = require('debug')('koa-stark:run:middleware:errors')
const util = require('util')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    debug(`handling error: ${util.inspect(err)}`)
    switch (err.status) {
      case 404:
        ctx.notFound()
        break
      case 500:
        ctx.internalServerError()
    }
  }
}
