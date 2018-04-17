'use strict'

let Model

const index = async ctx => {
  ctx.ok(await Model.find({}))
}

const show = async ctx => {
  const client = await Model.findById(ctx.params.id)
  client ? ctx.ok(client) : ctx.notFound()
}

const create = async ctx => {
  try {
    ctx.created(await Model.create(ctx.request.body))
  } catch (err) {
    ctx.badRequest(err)
  }
}

const update = async ctx => {
  try {
    const client = await Model.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body,
      {
        runValidators: true
      }
    )
    client ? ctx.noContent() : ctx.notFound()
  } catch (err) {
    ctx.badRequest(err)
  }
}

const destroy = async ctx => {
  const client = await Model.findByIdAndRemove(ctx.params.id)
  client ? ctx.noContent() : ctx.notFound()
}

module.exports = model => {
  Model = model
  return {
    index,
    show,
    create,
    update,
    destroy
  }
}
