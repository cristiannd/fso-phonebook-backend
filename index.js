const express = require('express')
const app = express()

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
]

// Get all people
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Get one person
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).send('This person not exist')
  }
})

// Get more information
app.get('/api/info', (request, response) => {
  response.send(`
  <div>
    Phonebook has info for ${persons.length} people
    ${new Date()}
  <div/>
  `)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const personToDelete = persons.find((person) => person.id === id)

  if (personToDelete) {
    const personsFilter = persons.filter((person) => person.id !== id)
    persons = personsFilter
    response
      .status(200)
      .send(`${personToDelete.name} has been successfully removed`)
  } else {
    response.status(404).send('This person not exist')
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
