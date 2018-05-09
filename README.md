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
npm install johnschult/koa-stark
```

## Usage

```javascript
const Koa = require('koa')
const stark = require('koa-stark')
const app = new Koa()

app.use(stark(options, app))

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
  * `resources` - _optional_, an array of objects where:
    * `name` - _required_, the name the resource, e.g. `'Robot'`
    * `path` - _required_, the path to the resource, e.g. `'/v1/clients'`
    * `mongooseSchema` - _optional_, the resource schema, a [mongoose.Schema](http://mongoosejs.com/docs/api.html#schema_Schema) object, if provided, a CRUD controller and routes will be generated for this resource
    * `swaggerSchema` - _required_, an [OpenAPI 2.0 Definitions Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#definitions-object)

## Resources

If `resources` is defined in `options`, the following routes are defined for each resource:

* `GET /<basePath>/<path>/` - Returns an array of all the models
* `POST /<basePath>/<path>/` - Creates a new model
* `GET /<basePath>/<path>/:id` - Finds a model by ID
* `PUT /<basePath>/<path>/:id` - Updates an existing model
* `DELETE /<basePath>/<path>/:id` - Deletes a model
* `GET /<basePath>/<path>/:id/exists` - Checks whether a model exists
* `GET /<basePath>/<path>/count` - Returns a count of all the models

### Watching Resources

A route is added using [socket.io](http://socket.io) to enable watching individual or all
model instance(s). In order to utilize the `watch` route, a [socket.io](http://socket.io) connection needs
to be made. For example:

```javascript
const io = require('socket.io-client')

const socket = io('ws://localhost:9006/api/v1/robots/watch')
```

#### Events

##### Client

* `watch` - Used to define the resources and operations you are interested
  in observing, _optional_ object where:
  * `id` - _optional_, the resource `id`
  * `operationType` - _optional_, one of `insert, update, delete`
* `done` - Indicates to the server that you are done. The server will close the
  watch stream, and disconnect.

##### Server

* `change` - The server emits changes to this event. A single argument is sent to the callback containing
  the change data.

##### Examples

**Watch all operations on all resource instances:**

```javascript
const io = require('socket.io-client')

const socket = io('ws://localhost:9006/api/v1/robots/watch')

socket.on('connect', () => {
  socket.emit('watch')
})

socket.on('change', data => {
  console.log(data)
})

socket.on('disconnect', () => {
  process.exit()
})
```

**Watch all update operation on a single resource instances and then tell the server you are done:**

```javascript
const io = require('socket.io-client')

const socket = io('ws://localhost:9006/api/v1/robots/watch')

socket.on('connect', () => {
  socket.emit('watch', {
    operationType: 'update',
    id: '5af2fe000e488a70acf4be22'
  })
})

socket.on('change', data => {
  console.log(data)
  socket.emit('done')
})

socket.on('disconnect', () => {
  process.exit()
})
```

## Example

A simple `koa` application is included in the `example` directory.

`koa-stark` is opinionated about the database being used and requires that you use MongoDB. Before running the example make changes to `mongo` in `example/config.js` as needed.

To run this example:

```shell
$ git clone https://github.com/johnschult/koa-stark
$ cd koa-stark && npm install
$ cd example && npm install
$ npm start
```

Browse to http://localhost:9005/api to use the OpenAPI 2.0 UI.
