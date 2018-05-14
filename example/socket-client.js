'use strict'

const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const util = require('util')
const io = require('socket.io-client')

const optionDefinitions = [
  {
    name: 'id',
    alias: 'i',
    type: String,
    description: 'The id of the resource to watch, default: all',
    typeLabel: '<id>'
  },
  {
    name: 'operationType',
    alias: 'o',
    type: String,
    description: 'The operation type(s) to watch, default: all',
    typeLabel: '<insert,update,delete>'
  },
  {
    name: 'disconnect',
    alias: 'd',
    type: Boolean,
    defaultValue: false,
    description:
      'Whether to disconnect after the first change from server is emitted, default: false'
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  }
]
const options = commandLineArgs(optionDefinitions)
if (options.help) {
  const usage = commandLineUsage([
    {
      header: 'Socket Client Example',
      content: 'A simple example demonstrating typical usage.'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    }
  ])
  console.log(usage)
} else {
  const socket = io('ws://localhost:9006/api/v1/robots/watch')
  if (options.operationType) {
    const o = options.operationType.split(',')
    if (o.length > 1) options.operationType = o
  }
  socket.on('connect', () => {
    socket.emit('watch', options)
  })

  socket.on('change', data => {
    console.log(util.inspect(data))
    if (options.disconnect) socket.disconnect()
  })

  socket.on('disconnect', () => {
    process.exit()
  })
}
