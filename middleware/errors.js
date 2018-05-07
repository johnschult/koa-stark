'use strict'

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    switch (err.status) {
      case 404:
        ctx.notFound()
        break
      case 500:
        ctx.internalServerError()
    }
  }
}
