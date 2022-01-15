const mongoose = require('mongoose')

mongoose
  .connect(process.env.DATABASE_URI)
  .then(res => console.log('Connected to database'))
  .catch(error => console.log('Connection error', error))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)




// const person = new Person({
//   name: personName,
//   number: personNumber,
// })

// person.save().then((result) => {
//   console.log(`Added ${result.name} number ${result.number} to phonebook`)
//   mongoose.connection.close()
// })