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
app.get('/api/persons', (request, response) => {
  Person.find({}).then((person) => response.json(person))
})

// Get a person
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => response.json(person))
})

// Create a person
app.post('/api/persons', (request, response) => {
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

  newPerson.save().then((personSave) => {
    response.json(personSave)
  })
})

// Delete a person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((res) => {
      console.log('Person deleted')
      response.status(204).end()
    })
    .catch((error) => response.json(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
