'use strict'

const merge = require('deepmerge')
const pathsFor = require('./paths')
const definitionsFor = require('./definitions')
const tagsFor = require('./tags')

module.exports = options => {
  const {
    basePath,
    host,
    port,
    swagger: {
      info,
      schemes = ['http'],
      consumes = ['application/json'],
      produces = ['application/json'],
      paths = {},
      definitions = {},
      responses = {},
      tags = [],
      externalDocs = {
        description:
          'Click here to learn about changing this link (externalDocs)',
        url:
          'https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#external-documentation-object'
      }
    },
    resources = []
  } = options

  return {
    swagger: '2.0',
    info,
    host: port !== 80 ? `${host}:${port}` : host,
    basePath,
    schemes,
    consumes,
    produces,
    paths: merge(paths, pathsFor(resources)),
    definitions: merge(definitions, definitionsFor(resources)),
    responses: merge(responses, require('./responses')),
    tags: tags.concat(tagsFor(resources)),
    externalDocs
  }
}
