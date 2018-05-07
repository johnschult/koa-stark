'use strict'

module.exports = {
  optionsSuccess: {
    description: 'OK',
    headers: {
      Allow: {
        description: 'The HTTP methods that are allowed for this path',
        type: 'string'
      }
    }
  },
  badRequest: {
    description: 'Bad Request',
    schema: {
      $ref: '#/definitions/Error'
    }
  },
  notFound: {
    description: `Resource not found`
  },
  invalidResourceId: {
    description: 'Invalid ID supplied'
  },
  noContent: {
    description: 'No Content'
  }
}
