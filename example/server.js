const Koa = require('koa')
const stark = require('../')
const config = require('./config')
const app = new Koa()

app.use(stark(config))

app.listen(9005)
if (config.swagger.ui) console.log('OpenAPI 2.0 UI: http://localhost:9005/api')
