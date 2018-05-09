'use strict'

let Model

const index = async ({ ok, request: { query: { where = '{}' } } }) => {
  ok(await Model.find(JSON.parse(where)))
}

const show = async ({ ok, notFound, params: { id } }) => {
  const model = await Model.findById(id)
  model ? ok(model) : notFound()
}

const create = async ({ created, badRequest, request: { body } }) => {
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
  try {
    const model = await Model.findByIdAndUpdate(id, body, {
      runValidators: true
    })
    model ? noContent() : notFound()
  } catch (err) {
    badRequest(err)
  }
}

const destroy = async ({ noContent, notFound, params: { id } }) => {
  const model = await Model.findByIdAndRemove(id)
  model ? noContent() : notFound()
}

const count = async ({ ok, request: { query: { where = '{}' } } }) => {
  ok({ count: await Model.count(JSON.parse(where)) })
}

const exists = async ({ ok, params: { id } }) => {
  const model = await Model.findById(id)
  ok({ exists: model !== undefined })
}

module.exports = model => {
  Model = model
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
