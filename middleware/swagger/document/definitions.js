'use strict'
const errorSchema = require('./schema/error.json')

module.exports = resources => {
  const definitions = {}
  for (let r of resources) {
    const { name, swaggerSchema } = r
    definitions[name] = swaggerSchema
  }
  return { ...definitions, Error: errorSchema }
}
