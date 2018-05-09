'use strict'

const mongoose = require('mongoose')
const IO = require('koa-socket')
const toJson = require('@meanie/mongoose-to-json')

mongoose.plugin(toJson)

const validateObjectId = (id, ctx, next) =>
  mongoose.Types.ObjectId.isValid(id)
    ? next()
    : ctx.send(422, 'Invalid ID supplied')

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

  return pipeline
}

const addChangeStream = (prefix, { name }, app) => {
  const io = new IO(`${prefix}/watch`)
  io.attach(app)

  io.on('watch', ({ socket }, { id, operationType } = {}) => {
    const pipeline = createPipeline({ id, operationType })
    const { driverChangeStream } = mongoose
      .model(name)
      .watch(pipeline, {
        fullDocument: 'updateLookup'
      })
      .on('change', ({ documentKey, operationType, fullDocument }) => {
        socket.emit('change', {
          operationType,
          model: { id: documentKey._id, ...fullDocument }
        })
      })

    socket.on('done', data => {
      socket.disconnect()
      driverChangeStream.close()
    })
  })
}

const addResourceRoutes = (prefix, { name, mongooseSchema, path }, router) => {
  if (mongooseSchema) {
    const ctlr = require('./controller')(mongoose.model(name, mongooseSchema))

    router.prefix(prefix)
    router.post('/', ctlr.create)
    router.get('/', ctlr.index)
    router.get('/count', ctlr.count)
    router.get('/:id/exists', ctlr.exists)
    router.param('id', validateObjectId).get('/:id', ctlr.show)
    router.param('id', validateObjectId).put('/:id', ctlr.update)
    router.param('id', validateObjectId).delete('/:id', ctlr.destroy)
  }
}

module.exports = ({ mongo, basePath, resources }, app) => {
  mongo && mongoose.connect(mongo)
  const router = require('koa-router')()
  for (let r of resources) {
    const prefix = `${basePath}${r.path}`
    addResourceRoutes(prefix, r, router)
    addChangeStream(prefix, r, app)
  }
  return router
}
