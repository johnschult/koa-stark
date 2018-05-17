'use strict'

const mongoose = require('mongoose')
const util = require('util')
const IO = require('koa-socket')
const debug = require('debug')
const resourcesDebugLog = debug('koa-stark:init:resources')
let socketDebugLog

const createPipeline = ({ id, operationType }) => {
  const pipeline = []
  const objectIdExpr = { 'documentKey._id': new mongoose.Types.ObjectId(id) }
  const operationTypeExpr =
    operationType instanceof Array
      ? { operationType: { $in: operationType } }
      : { operationType: operationType }

  if (id && operationType) {
    pipeline.push({
      $match: {
        $and: [objectIdExpr, operationTypeExpr]
      }
    })
  } else if (id) pipeline.push({ $match: objectIdExpr })
  else if (operationType) {
    pipeline.push({ $match: operationTypeExpr })
  }

  pipeline.push({
    $project: {
      'fullDocument._id': false,
      'fullDocument.__v': false
    }
  })
  socketDebugLog(`watch pipeline is: ${util.inspect(pipeline)}`)
  return pipeline
}

module.exports = (prefix, { name }, prometheusClient) => {
  socketDebugLog = debug(`koa-stark:run:socket:${name.toLowerCase()}`)
  resourcesDebugLog(`adding watch stream for: ${name}`)
  const watchHistogram = new prometheusClient.Histogram({
    name: `${name.toLowerCase()}_watch_requests`,
    help: `used to keep track of socket connections for ${name.toLowerCase()} watch`,
    labelNames: ['action'],
    buckets: [60, 120, 180, 240, 300, 360, 420, 480]
  })
  let end

  return new IO(`${prefix}/watch`).on(
    'watch',
    ({ socket }, { id, operationType } = {}) => {
      end = watchHistogram.startTimer({ action: 'watch' })

      socketDebugLog(
        `client connected to watch and sent: ${util.inspect({
          id,
          operationType
        })}`
      )
      const pipeline = createPipeline({ id, operationType })
      const { driverChangeStream } = mongoose
        .model(name)
        .watch(pipeline, {
          fullDocument: 'updateLookup'
        })
        .on('change', change => {
          const { documentKey, operationType, fullDocument } = change
          socketDebugLog(`emitting change to client: ${util.inspect(change)}`)
          socket.emit('change', {
            operationType,
            model: { id: documentKey._id, ...fullDocument }
          })
        })

      socket.on('disconnect', () => {
        socketDebugLog('client disconnected, closing mongo watch stream')
        driverChangeStream.close()
        end()
      })
    }
  )
}
