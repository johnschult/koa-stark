'use strict'

const body = require('koa-body')
const compose = require('koa-compose')
const compress = require('koa-compress')
const conditional = require('koa-conditional-get')
const cors = require('@koa/cors')
const etag = require('koa-etag')
const helmet = require('koa-helmet')
const respond = require('koa-respond')
const responseTime = require('koa-response-time')
const logging = require('./logging')
const swagger = require('./swagger')
const errors = require('./errors')

module.exports = options => {
  return compose([
    respond(),
    errors,
    responseTime(),
    helmet({
      frameguard: {
        action: 'deny' // Set the `X-Frame-Options' header to be `DENY`
      }
    }),
    cors(),
    compress({
      threshold: 2048 // Sets the threshold to Gzip responses at 2k (2048 bytes)
    }),
    conditional(),
    etag(),
    body({
      jsonLimit: '10kb' // Sets the json request body limit to 10k
    }),
    ...logging(options),
    ...swagger(options)
  ])
}
