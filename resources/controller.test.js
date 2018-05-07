'use strict'

const Koa = require('koa')
const mongoose = require('mongoose')
const stark = require('../')
const request = require('supertest')
const sinon = require('sinon')
require('sinon-mongoose')

const config = {
  basePath: '/api',
  mongo: false,
  logging: false,
  swagger: false,
  resources: [
    {
      name: 'Robot',
      path: '/v1/robots',
      mongooseSchema: new mongoose.Schema({ name: { type: String } })
    }
  ]
}

const app = new Koa()
app.use(stark(config))
const server = app.listen(config.port)

const { name, path, schema } = config.resources[0]
const resourcePath = `${config.basePath}${path}`
const RobotMock = sinon.mock(mongoose.model(name, schema))

afterEach(() => {
  server.close()
})

describe('resources: robots index', () => {
  let allRobots = []
  let response

  beforeEach(async () => {
    RobotMock.expects('find')
      .chain('exec')
      .resolves(allRobots)
    response = await request(server).get(resourcePath)
  })

  test('responds with 200', () => {
    expect(response.status).toEqual(200)
  })

  test('returns an array', () => {
    expect(response.body).toMatchObject(allRobots)
  })
})

describe('resources: robots count', () => {
  let response

  beforeEach(async () => {
    RobotMock.expects('count')
      .chain('exec')
      .resolves(1)
    response = await request(server).get(`${resourcePath}/count`)
  })

  test('responds with 200', () => {
    expect(response.status).toEqual(200)
  })

  test('returns an object', () => {
    expect(response.body).toMatchObject({count: 1})
  })
})

let model = { name: 'the model' }
let modelId = '507f191e810c19729de860ea'

describe('resources: robots show', () => {
  let response

  describe('success', () => {
    beforeEach(async () => {
      RobotMock.expects('findById')
        .withArgs(modelId)
        .chain('exec')
        .resolves(model)
      response = await request(server).get(`${resourcePath}/${modelId}`)
    })

    test('responds with 200', () => {
      expect(response.status).toEqual(200)
    })

    test('returns an object', () => {
      expect(response.body).toMatchObject(model)
    })
  })

  describe('failure', () => {
    test('responds with 404 when the model is not found', async () => {
      RobotMock.expects('findById')
        .withArgs(modelId)
        .chain('exec')
        .resolves()
      response = await request(server).get(`${resourcePath}/${modelId}`)
      expect(response.status).toEqual(404)
    })

    test('responds with 400 when the id is malformed', async () => {
      response = await request(server).get(`${resourcePath}/foo`)
      expect(response.status).toEqual(400)
    })
  })
})

describe('resources: robots create', () => {
  let response

  describe('success', () => {
    beforeEach(async () => {
      RobotMock.expects('create')
        .withArgs(model)
        .chain('exec')
        .resolves(model)
      response = await request(server)
        .post(resourcePath)
        .type('json')
        .send(model)
    })

    test('responds with a 201', () => {
      expect(response.status).toEqual(201)
    })

    test('returns an object', () => {
      expect(response.body).toEqual(model)
    })
  })

  describe('failure', () => {
    let errors = { code: 'ERROR', errors: [] }

    beforeEach(async () => {
      RobotMock.expects('create')
        .withArgs(model)
        .chain('exec')
        .throws(errors)
      response = await request(server)
        .post(resourcePath)
        .type('json')
        .send(model)
    })

    test('responds with a 400', () => {
      expect(response.status).toEqual(400)
    })

    test('returns errors object', () => {
      expect(response.body).toEqual(errors)
    })
  })
})

describe('resources: robots update', () => {
  let response

  describe('success', () => {
    beforeEach(async () => {
      RobotMock.expects('findByIdAndUpdate')
        .withArgs(modelId, model, { runValidators: true })
        .chain('exec')
        .resolves(model)
      response = await request(server)
        .put(`${resourcePath}/${modelId}`)
        .type('json')
        .send(model)
    })

    test('responds with a 204', () => {
      expect(response.status).toEqual(204)
    })

    test('returns nothing', () => {
      expect(response.body).toEqual({})
    })
  })

  describe('failure', () => {
    let errors = { code: 'ERROR', errors: [] }

    beforeEach(async () => {
      RobotMock.expects('findByIdAndUpdate')
        .withArgs(modelId, model, { runValidators: true })
        .chain('exec')
        .throws(errors)
      response = await request(server)
        .put(`${resourcePath}/${modelId}`)
        .type('json')
        .send(model)
    })

    test('responds with a 400', () => {
      expect(response.status).toEqual(400)
    })

    test('returns errors object', () => {
      expect(response.body).toEqual(errors)
    })
  })
})

describe('resources: robots delete', () => {
  let response

  beforeEach(async () => {
    RobotMock.expects('findByIdAndRemove')
      .withArgs(modelId)
      .chain('exec')
      .resolves(model)
    response = await request(server).delete(`${resourcePath}/${modelId}`)
  })

  test('responds with a 204', () => {
    expect(response.status).toEqual(204)
  })

  test('returns nothing', () => {
    expect(response.body).toEqual({})
  })
})
