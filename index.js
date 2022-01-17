require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(
  morgan(
    'Method: :method \nURL: :url \nStatus: :status \nTime: :response-time ms \n'
  )
)

// Get all people
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((people) => response.json(people))
    .catch((error) => next(error))
})

// Get a person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((error) => next(error))
})

// Get info
app.get('/api/info', (request, response, next) => {
  Person.find({}).then((people) =>
    response.status(200).send(`There are ${people.length} people registrated`)
  )
})

// Create a person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  if (!newPerson.name || !newPerson.number) {
    return response
      .status(400)
      .send({ error: 'You should complete all inputs' })
  }

  newPerson
    .save()
    .then((personSave) => {
      response.json(personSave)
    })
    .catch((error) => next(error))
})

// Delete a person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((res) => {
      console.log('Person deleted')
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// Update a person
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

// Manejador de errores
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'Input name and input number must be unique'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
