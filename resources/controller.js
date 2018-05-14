'use strict'

const util = require('util')
const mongoose = require('mongoose')

let Model
let debug

const index = async ({ ok, request: { query: { where = '{}' } } }) => {
  debug(`index: ${util.inspect(where)}`)
  ok(await Model.find(JSON.parse(where)))
}

const show = async ({ ok, notFound, params: { id } }) => {
  debug(`show: ${id}`)
  const model = await Model.findById(id)
  debug(`model: ${util.inspect(model)}`)
  model ? ok(model) : notFound()
}

const create = async ({ created, badRequest, request: { body } }) => {
  debug(`create: ${util.inspect(body)}`)
  try {
    created(await Model.create(body))
  } catch (err) {
    badRequest(err)
  }
}

const update = async ({
  noContent,
  notFound,
  badRequest,
  params: { id },
  request: { body }
}) => {
  debug(`update: ${util.inspect({ id, body })}`)
  try {
    const model = await Model.findByIdAndUpdate(id, body, {
      runValidators: true
    })
    debug(`model: ${util.inspect(model)}`)
    model ? noContent() : notFound()
  } catch (err) {
    badRequest(err)
  }
}

const destroy = async ({ noContent, notFound, params: { id } }) => {
  debug(`destroy: ${id}`)
  const model = await Model.findByIdAndRemove(id)
  debug(`model: ${util.inspect(model)}`)
  model ? noContent() : notFound()
}

const count = async ({ ok, request: { query: { where = '{}' } } }) => {
  debug(`count: ${util.inspect(where)}`)
  ok({ count: await Model.count(JSON.parse(where)) })
}

const exists = async ({ ok, params: { id } }) => {
  debug(`exists: ${id}`)
  const model = await Model.findById(id)
  debug(`model: ${util.inspect(model)}`)
  ok({ exists: model !== null })
}

module.exports = (name, schema) => {
  Model = mongoose.model(name, schema)
  debug = require('debug')(`koa-stark:run:controller:${name.toLowerCase()}`)

  return {
    index,
    show,
    create,
    update,
    destroy,
    count,
    exists
  }
}
