'use strict'

const debug = require('debug')('koa-stark:init:middleware:swagger')
const util = require('util')

const swaggerMiddleware = options => {
  const middleware = []
  const { swagger: swaggerOptions, basePath, resources = [] } = options

  if (swaggerOptions) {
    const swagger2 = require('swagger2')
    const { ui: useUi, validate: useValidate, spec } = swaggerOptions
    if (!swagger2.validateDocument(spec)) {
      throw Error(
        `options.swagger.spec does not conform to the OpenAPI 2.0 schema.
        See: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md`
      )
    }
    if (useUi) {
      const { ui } = require('swagger2-koa')
      const { swagger: { paths = {} } } = options
      const skipPaths = Object.keys(paths)
        .map(p => `${basePath}${p}`)
        .concat(resources.map(r => `${basePath}${r.path}`))
      middleware.push(ui(spec, basePath, skipPaths))
    }
    if (useValidate) {
      const { validate } = require('swagger2-koa')
      middleware.push(validate(spec))
    }
  }
  return middleware
}

module.exports = options => {
  debug(`swagger: ${util.inspect(options.swagger)}`)
  if (!options.swagger) return []
  options.swagger.spec = require('./document')(options)
  return swaggerMiddleware(options)
}
