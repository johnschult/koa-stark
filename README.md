# koa-stark

This module provides a set of `koa` middleware and optional CRUD resource(s). Middleware include:

* `koa-response-time`
* `koa-helmet`
* `@koa/cors`
* `koa-compress`
* `koa-conditional-get`
* `koa-etag`
* `koa-respond`
* `koa-body`
* `koa-pino-logger`
* `swagger2-koa`

## Installation

Install using [npm](https://www.npmjs.org/):

```
npm install koa-stark
```

### Usage

```javascript
const Koa = require('koa')
const stark = require('koa-stark')
const app = new Koa()

app.use(stark(options))

app.listen(9000)
```

The above creates a `koa` server with `koa-stark` middleware, where:

* `options` - _optional_, object where:
  * `basePath` - _optional_, a base path to serve requests from, e.g. `'/api'`
  * `mongo` - _required if `swagger.spec` includes paths that require CRUD_, a [standard MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/#standard-connection-string-format)
  * `logging` - _optional_, if set to `true` will use `koa-pino-logger`
  * `swagger` - _optional_, an object where:
    * `validate` - _optional_, if set to `true` will validate requests and responses using `swagger2-koa.validate`
    * `ui` - _optional_, if set to `true` will serve a [Swagger UI](https://swagger.io/swagger-ui/) at `options.basePath` using `swagger2-koa.ui`
    * `spec` - _required if `ui` or `validate` are `true`_, an object that conforms to the [OpenAPI 2.0 schema](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)
  * `resources` - _required if `swagger.spec` includes paths that require CRUD_, an array of objects where:
    * `name` - _required_, the name the resource, e.g. `'Robot'`
    * `path` - _required_, the path to the resource, e.g. `'/v1/clients'`
    * `schema` - _required_, the resource schema, a [mongoose.Schema](http://mongoosejs.com/docs/api.html#schema_Schema) object

#### Options example

```javascript
{
  basePath: '/api',
  mongo: 'mongodb://127.0.0.1/stark-industries',
  swagger: {
    ui: true,
    validate: true
  },
  resources: [
    {
      name: 'Robot',
      path: '/v1/robots',
      schema: require('../resources/robots/v1/robot.schema')
    }
  ]
}
```
