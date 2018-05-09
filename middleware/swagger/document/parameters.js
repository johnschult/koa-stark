'use strict'

module.exports = resources => {
  const parameters = {
    where: {
      name: 'where',
      in: 'query',
      description:
        'An optional query to match model instances, see: https://docs.mongodb.com/manual/tutorial/query-documents',
      required: false,
      type: 'string',
      format: 'JSON'
    },
    id: {
      name: 'id',
      in: 'path',
      description: 'The ID of the model',
      required: true,
      type: 'string'
    }
  }

  for (let r of resources) {
    const { name } = r
    parameters[`${name.toLowerCase()}Model`] = {
      in: 'body',
      name: 'body',
      description: `The model object`,
      required: true,
      schema: {
        $ref: `#/definitions/${name}`
      }
    }
  }

  return parameters
}
