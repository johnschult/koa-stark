'use strict'

module.exports = {
  badRequest: {
    description: 'Bad Request',
    schema: {
      $ref: '#/definitions/Error'
    }
  },
  notFound: {
    description: 'Not Found'
  },
  unprocessableEntity: {
    description: 'Unprocessable Entity',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Invalid ID supplied'
        }
      }
    }
  },
  noContent: {
    description: 'No Content'
  }
}
