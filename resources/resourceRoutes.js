'use strict'

const debug = require('debug')
const resourcesDebugLog = debug('koa-stark:init:resources')
const routerDebugLog = debug('koa-stark:run:router')
const mongoose = require('mongoose')
const router = require('koa-router')()

const validateObjectId = (id, ctx, next) => {
  routerDebugLog(`validating object id: ${id}`)
  if (mongoose.Types.ObjectId.isValid(id)) return next()
  ctx.send(422, 'Invalid ID supplied')
}

module.exports = (prefix, { name, mongooseSchema, path }) => {
  resourcesDebugLog(`adding resource routes for: ${name}`)
  const ctlr = require('./controller')(name, mongooseSchema)

  router.prefix(prefix)
  router.post('/', ctlr.create)
  router.get('/', ctlr.index)
  router.get('/count', ctlr.count)
  router
    .param('id', validateObjectId)
    .get('/:id', ctlr.show)
    .get('/:id/exists', ctlr.exists)
    .put('/:id', ctlr.update)
    .delete('/:id', ctlr.destroy)
  return router.routes()
}
