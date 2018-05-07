'use strict'

module.exports = resources =>
  resources.map(r => {
    const { name, path } = r
    return { name: path, description: `${name} operations` }
  })
