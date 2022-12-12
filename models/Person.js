const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// create schema
const personSchema = new Schema({
  name: {
    type: String,
    unique:true,
    uniqueCaseInsensitive: true,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})

personSchema.plugin(uniqueValidator)

personSchema.
  set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
// create model
const Person = model('Person', personSchema)

module.exports = Person 