'use strict'

const errorSchema = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      example: 'SWAGGER_RESPONSE_VALIDATION_FAILED'
    },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          actual: {
            type: 'object'
          },
          expected: {
            type: 'object',
            properties: {
              schema: {
                type: 'object'
              }
            }
          },
          where: {
            type: 'string',
            example: 'response'
          }
        }
      }
    }
  }
}

module.exports = resources => {
  const definitions = {}
  for (let r of resources) {
    const { name, swaggerSchema } = r
    definitions[name] = swaggerSchema
  }
  return { ...definitions, Error: errorSchema }
}
