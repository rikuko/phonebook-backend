const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]

const url =
    `mongodb+srv://rikuikoskinen:${password}@cluster0.81st1.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
    Contact.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const contact = new Contact({
        name: contactName,
        number: contactNumber,
    })

    contact.save().then(result => {
        console.log(`Added ${contactName} number ${contactNumber} to phonebook`)
        mongoose.connection.close()
    })
}
