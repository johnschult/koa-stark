'use strict'

const mongoose = require('mongoose')

/*
  Create Mongoose Schema

  This creates a Robot with two properties and
  timestamps (`createdAt` and `updatedAt`).

  - See: http://mongoosejs.com/docs/guide.html
*/
const Robot = new mongoose.Schema(
  {
    name: { type: String },
    secret: { type: String }
  },
  { timestamps: true }
)

/*
 Mongoose Schema Hook

 - See: http://mongoosejs.com/docs/api.html#schema_Schema-pre

 The `secret` value is set when the Robot is new
 and is never changed after it is saved.

 Since `secret` is `readOnly` in `swaggerSchema`, if `swagger.validate` is `true`,
 `secret` will be ignored in API requests.

 */
Robot.pre('validate', function (next) {
  if (this.isNew) {
    this.secret = 'anything'
  }
  next()
})

module.exports = Robot
