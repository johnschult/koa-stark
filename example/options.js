module.exports = {
  host: 'localhost',
  port: 9006,
  basePath: '/api',
  mongo:
    'mongodb://localhost:27017,locahost:27018,localhost:27019/stark-industries?replicaSet=rs0',
  logging: true,
  swagger: {
    info: {
      description: 'The Robots API',
      version: '0.0.1',
      title: 'Robot Microservice',
      termsOfService: 'The Terms of Service for the API.',
      contact: {
        email: 'js798p@att.com'
      },
      license: {
        name: 'UNLICENSED',
        url: 'http://att.com'
      }
    },
    paths: {
      '/v1/hello': {
        get: {
          description: 'Return hello',
          tags: ['/v1/hello'],
          produces: ['application/json'],
          responses: {
            '200': {
              description: 'Hello',
              schema: {
                $ref: '#/definitions/Message'
              }
            }
          }
        }
      }
    },
    definitions: {
      Message: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          }
        }
      }
    },
    tags: [{ name: '/v1/hello', description: 'Hello operations' }],
    ui: true,
    validate: true
  },
  resources: [
    {
      name: 'Robot',
      path: '/v1/robots',
      mongooseSchema: require('./robot.schema'),
      swaggerSchema: {
        type: 'object',
        required: ['name'],
        properties: {
          id: {
            type: 'string',
            description: 'The object ID',
            example: '507f191e810c19729de860ea',
            readOnly: true
          },
          name: {
            type: 'string',
            description: 'The name of the Robot',
            example: 'My Robot'
          },
          secret: {
            type: 'string',
            description: 'The secret of the Robot',
            example: 'anything',
            readOnly: true
          },
          createdAt: {
            example: '2018-04-14T18:41:13.586Z',
            readOnly: true
          },
          updatedAt: {
            example: '2018-04-14T18:41:13.586Z',
            readOnly: true
          }
        }
      }
    }
  ]
}
