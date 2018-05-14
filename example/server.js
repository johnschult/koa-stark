const Koa = require('koa')
const stark = require('../')
const options = require('./options')
const app = new Koa()
const { basePath, port, host, swagger: { ui } } = options

app.use(stark(options, app))

app.use(
  require('koa-router')()
    .get('/api/v1/hello', ctx => {
      ctx.body = { message: 'hello' }
    })
    .routes()
)

app.listen(port, host)

if (ui) {
  console.log(
    `Server started: OpenAPI 2.0 UI: http://${host}:${port}${basePath}`
  )
}
