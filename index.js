require('dotenv').config()
require('./mongo')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/Person')

const requestLogger = require('./middlewares/requestLogger')
const unknownEndpoint = require('./middlewares/unknowEndpoint')
const errorHandler = require('./middlewares/errorHandler')
const { default: mongoose } = require('mongoose')

morgan.token('id', (req) => req.id)
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())
morgan.token('request-body', (req) => JSON.stringify(req.body))
app.use(morgan(':id :method :url :status :response-time :body'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.get('/api/info', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(
      `Phonebook has info ${persons.length} people ${new Date()}`
    )
  }).catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
  res.status(204).end()
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (body.content === undefined)  return res.status(400).json({ error: 'content missing' })
  if (!body.name) return res.status(400).json({ error: 'The name is missing' })
  if (!body.number) return res.status(400).json({ error: 'The number is missing' })

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => res.json(savedAndFormattedPerson))
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson =>
      res.json(updatedPerson))
    .catch(err => next(err))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})