module.exports = resource => {
  const { name, path } = resource
  const pluralResourceName = path.split('/').pop()
  const lowerCaseName = name.toLowerCase()

  const collectionPaths = {}
  const instancePaths = {}
  const otherPaths = {}

  collectionPaths[path] = {
    get: {
      summary: `Returns an array of all the ${pluralResourceName}`,
      tags: [path],
      operationId: `${name}.index`,
      parameters: [{ $ref: '#/parameters/where' }],
      responses: {
        '200': {
          description: 'OK',
          schema: {
            type: 'array',
            items: {
              $ref: `#/definitions/${name}`
            }
          }
        }
      }
    },
    post: {
      summary: `Creates a new ${lowerCaseName}`,
      tags: [path],
      operationId: `${name}.create`,
      description: '',
      parameters: [{ $ref: `#/parameters/${lowerCaseName}Model` }],
      responses: {
        '201': {
          description: 'Created',
          schema: {
            $ref: `#/definitions/${name}`
          }
        },
        '400': { $ref: '#/responses/badRequest' }
      }
    }
  }

  instancePaths[`${path}/{id}`] = {
    parameters: [{ $ref: '#/parameters/id' }],
    get: {
      summary: `Finds a ${lowerCaseName} by ID`,
      tags: [path],
      operationId: `${name}.show`,
      description: `Returns a single ${lowerCaseName}`,
      parameters: [{ $ref: '#/parameters/id' }],
      responses: {
        '200': {
          description: 'OK',
          schema: {
            $ref: `#/definitions/${name}`
          }
        },
        '422': { $ref: '#/responses/unprocessableEntity' },
        '404': { $ref: '#/responses/notFound' }
      }
    },
    put: {
      summary: `Updates an existing ${lowerCaseName}`,
      tags: [path],
      operationId: `${name}.update`,
      description: `Updates a single ${lowerCaseName}`,
      parameters: [
        { $ref: '#/parameters/id' },
        { $ref: `#/parameters/${lowerCaseName}Model` }
      ],
      responses: {
        '204': { $ref: '#/responses/noContent' },
        '400': { $ref: '#/responses/badRequest' },
        '404': { $ref: '#/responses/notFound' }
      }
    },
    delete: {
      summary: `Deletes a ${lowerCaseName}`,
      tags: [path],
      operationId: `${name}.destroy`,
      description: '',
      parameters: [{ $ref: '#/parameters/id' }],
      responses: {
        '204': { $ref: '#/responses/noContent' },
        '422': { $ref: '#/responses/unprocessableEntity' },
        '404': { $ref: '#/responses/notFound' }
      }
    }
  }

  otherPaths[`${path}/{id}/exists`] = {
    get: {
      summary: `Checks whether a ${lowerCaseName} exists`,
      tags: [path],
      operationId: `${name}.exists`,
      parameters: [{ $ref: '#/parameters/id' }],
      responses: {
        '200': {
          description: 'OK',
          schema: {
            type: 'object',
            properties: {
              exists: {
                type: 'boolean'
              }
            }
          }
        },
        '422': { $ref: '#/responses/unprocessableEntity' }
      }
    }
  }
  otherPaths[`${path}/count`] = {
    get: {
      summary: `Returns a count of all the ${pluralResourceName}`,
      tags: [path],
      operationId: `${name}.count`,
      parameters: [{ $ref: '#/parameters/where' }],
      responses: {
        '200': {
          description: 'OK',
          schema: {
            type: 'object',
            properties: {
              count: {
                type: 'number',
                format: 'double'
              }
            }
          }
        }
      }
    }
  }

  return { ...collectionPaths, ...instancePaths, ...otherPaths }
}
