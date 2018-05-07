module.exports = resource => {
  const { name, path } = resource
  const pluralResourceName = path.split('/').pop()
  const lowerCaseName = name.toLowerCase()

  const collectionPaths = {}
  const instancePaths = {}
  const otherPaths = {}

  collectionPaths[path] = {
    options: {
      summary: 'Get the allowed HTTP methods',
      tags: [path],
      operationId: `${name}.options`,
      description: 'The HTTP methods that are allowed for this path',
      responses: {
        '200': { $ref: '#/responses/optionsSuccess' }
      }
    },
    get: {
      summary: `Returns an array of all the ${pluralResourceName}`,
      tags: [path],
      operationId: `${name}.index`,
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
      summary: `Add a new ${lowerCaseName}`,
      tags: [path],
      operationId: `${name}.create`,
      description: '',
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: `${name} object that needs to be added`,
          required: true,
          schema: {
            $ref: `#/definitions/${name}`
          }
        }
      ],
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
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: `ID of a ${lowerCaseName}`,
        required: true,
        type: 'string'
      }
    ],
    options: {
      summary: 'Get the allowed HTTP methods',
      tags: [path],
      operationId: `${name}.instance_options`,
      description: 'The HTTP methods that are allowed for this path',
      responses: {
        '200': { $ref: '#/responses/optionsSuccess' }
      }
    },
    get: {
      summary: `Find ${lowerCaseName} by ID`,
      tags: [path],
      operationId: `${name}.show`,
      description: `Returns a single ${lowerCaseName}`,
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: `ID of ${lowerCaseName} to return`,
          required: true,
          type: 'string'
        }
      ],
      responses: {
        '200': {
          description: 'Successful operation',
          schema: {
            $ref: `#/definitions/${name}`
          }
        },
        '400': { $ref: '#/responses/invalidResourceId' },
        '404': { $ref: '#/responses/notFound' }
      }
    },
    put: {
      summary: `Update an existing ${lowerCaseName}`,
      tags: [path],
      operationId: `${name}.update`,
      description: '',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: `${name} id to delete`,
          required: true,
          type: 'string'
        },
        {
          in: 'body',
          name: 'body',
          description: `${name} object that needs to be updated`,
          required: true,
          schema: {
            $ref: `#/definitions/${name}`
          }
        }
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
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: `The id of the ${name}`,
          required: true,
          type: 'string'
        }
      ],
      responses: {
        '204': { $ref: '#/responses/noContent' },
        '400': { $ref: '#/responses/invalidResourceId' },
        '404': { $ref: '#/responses/notFound' }
      }
    }
  }

  otherPaths[`${path}/count`] = {
    get: {
      summary: `Returns a count of all the ${pluralResourceName}`,
      tags: [path],
      operationId: `${name}.count`,
      parameters: [
        {
          name: 'where',
          in: 'query',
          description: 'Criteria to match model instances',
          required: false,
          type: 'string',
          format: 'JSON'
        }
      ],
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

  return Object.assign(collectionPaths, otherPaths, instancePaths)
}
