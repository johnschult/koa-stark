'use strict'

const mongoose = require('mongoose')

const Robot = new mongoose.Schema(
  {
    name: { type: String },
    secret: { type: String }
  },
  { timestamps: true }
)

Robot.pre('validate', function (next) {
  if (this.isNew) {
    this.secret = 'something'
  }
  next()
})

module.exports = Robot
