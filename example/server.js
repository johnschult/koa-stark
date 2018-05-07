const Koa = require('koa')
const router = require('koa-router')()
const stark = require('../')
const config = require('./config')
const app = new Koa()

app.use(stark(config))

app.use(
  router
    .get('/api/v1/hello', (ctx, next) => {
      ctx.body = { message: 'hello' }
    })
    .routes()
)

app.listen(config.port, config.host)
if (config.swagger.ui) {
  console.log(
    `OpenAPI 2.0 UI: http://${config.host}:${config.port}${config.basePath}`
  )
}
