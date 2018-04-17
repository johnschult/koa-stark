'use strict'

const compose = require('koa-compose')
const mongoose = require('mongoose')

const validateObjectId = (id, ctx, next) =>
  mongoose.Types.ObjectId.isValid(id) ? next() : ctx.badRequest()

const resourceRouter = ({ basePath, resources }) => {
  const router = require('koa-router')()
  for (let r of resources) {
    const ctlr = require('./resources/controller.js')(
      mongoose.model(r.name, r.schema)
    )
    router.prefix(`${basePath}${r.path}`)
    router.post('/', ctlr.create)
    router.get(r.path, '/', ctlr.index)
    router.param('id', validateObjectId).get('/:id', ctlr.show)
    router.param('id', validateObjectId).put('/:id', ctlr.update)
    router.param('id', validateObjectId).delete('/:id', ctlr.destroy)
  }
  return router
}

module.exports = options => {
  options.mongo && mongoose.connect(options.mongo)
  const router = resourceRouter(options)
  return compose([
    require('./middleware')(options),
    router.routes(),
    router.allowedMethods()
  ])
}
