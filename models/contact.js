const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Create connection to', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to database')
    })
    .catch((error) => {
        console.log('Error connecting to database:', error.message)
    })

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
    },
    number: String,
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)