module.exports = {
  basePath: '/api',
  mongo: 'mongodb://127.0.0.1/stark-industries',
  swagger: {
    ui: true,
    validate: true,
    spec: require('./swagger.json')
  },
  resources: [
    {
      name: 'Robot',
      path: '/v1/robots',
      schema: require('./robot.schema')
    }
  ]
}
