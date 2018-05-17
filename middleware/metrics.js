'use strict'

const router = require('koa-router')()

module.exports = ({ prometheusClient }) =>
  router
    .get('/metrics', ctx => {
      ctx.type = 'text/plain'
      ctx.body = prometheusClient.register.metrics()
    })
    .routes()
