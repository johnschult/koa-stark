'use strict'
const debug = require('debug')
const resourcesDebugLog = debug('koa-stark:init:resources')
const routerDebugLog = debug('koa-stark:run:router')
const socketDebugLog = debug('koa-stark:run:socket')

const util = require('util')

const mongoose = require('mongoose')
const IO = require('koa-socket')
const toJson = require('@meanie/mongoose-to-json')

mongoose.plugin(toJson)

const validateObjectId = (id, ctx, next) => {
  routerDebugLog(`validating object id: ${id}`)
  if (mongoose.Types.ObjectId.isValid(id)) return next()
  ctx.send(422, 'Invalid ID supplied')
}

const createPipeline = ({ id, operationType }) => {
  const pipeline = []
  const objectIdExpr = { 'documentKey._id': new mongoose.Types.ObjectId(id) }
  const operationTypeExpr = { operationType: operationType }

  if (id && operationType) {
    pipeline.push({
      $match: {
        $and: [objectIdExpr, operationTypeExpr]
      }
    })
  } else if (id) pipeline.push({ $match: objectIdExpr })
  else if (operationType) {
    pipeline.push({ $match: operationTypeExpr })
  }

  pipeline.push({
    $project: {
      'fullDocument._id': false,
      'fullDocument.__v': false
    }
  })
  socketDebugLog(`watch pipeline is: ${util.inspect(pipeline)}`)
  return pipeline
}

const addWatchStream = (prefix, { name }, app) => {
  resourcesDebugLog(`adding watch stream for: ${name}`)
  const io = new IO(`${prefix}/watch`)
  io.attach(app)

  io.on('watch', ({ socket }, { id, operationType } = {}) => {
    socketDebugLog(
      `client connected to watch and sent: ${util.inspect({
        id,
        operationType
      })}`
    )
    const pipeline = createPipeline({ id, operationType })
    const { driverChangeStream } = mongoose
      .model(name)
      .watch(pipeline, {
        fullDocument: 'updateLookup'
      })
      .on('change', change => {
        const { documentKey, operationType, fullDocument } = change
        socketDebugLog(`emitting change to client: ${util.inspect(change)}`)
        socket.emit('change', {
          operationType,
          model: { id: documentKey._id, ...fullDocument }
        })
      })

    socket.on('disconnect', () => {
      socketDebugLog('client disconnected, closing mongo watch stream')
      driverChangeStream.close()
    })
  })
}

const addResourceRoutes = (prefix, { name, mongooseSchema, path }, router) => {
  resourcesDebugLog(`adding resource routes for: ${name}`)
  const ctlr = require('./controller')(mongoose.model(name, mongooseSchema))

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
}

module.exports = ({ mongo, basePath, resources }, app) => {
  resourcesDebugLog('loading resources')
  if (mongo) {
    resourcesDebugLog(`connecting to mongo using: ${mongo}`)
    mongoose.connect(mongo)
  }
  const router = require('koa-router')()
  for (let r of resources) {
    resourcesDebugLog(`loading resource: ${util.inspect(r)}`)
    const prefix = `${basePath}${r.path}`
    if (r.mongooseSchema) {
      addResourceRoutes(prefix, r, router)
      addWatchStream(prefix, r, app)
    }
  }
  return router
}
