'use strict'

const mongoose = require('mongoose')
const toJson = require('@meanie/mongoose-to-json')

mongoose.plugin(toJson)

const validateObjectId = (id, ctx, next) =>
  mongoose.Types.ObjectId.isValid(id) ? next() : ctx.badRequest()

module.exports = ({ mongo, basePath, resources }) => {
  mongo && mongoose.connect(mongo)

  const router = require('koa-router')()
  for (let r of resources) {
    if (r.mongooseSchema) {
      const ctlr = require('./controller')(
        mongoose.model(r.name, r.mongooseSchema)
      )
      router.prefix(`${basePath}${r.path}`)
      router.post('/', ctlr.create)
      router.get('/', ctlr.index)
      router.get('/count', ctlr.count)
      router.param('id', validateObjectId).get('/:id', ctlr.show)
      router.param('id', validateObjectId).put('/:id', ctlr.update)
      router.param('id', validateObjectId).delete('/:id', ctlr.destroy)
    }
  }
  return router
}
