const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const nameDataBase = 'phonebook'
const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@sandbox.cga4r.mongodb.net/${nameDataBase}?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then((people) => {
    console.log('Phonebook:')
    people.forEach((person) => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: personName,
    number: personNumber,
  })

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
