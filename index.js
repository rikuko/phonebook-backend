const express = require('express')
const app = express()

app.use(express.json())

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const time = new Date().toUTCString()
    response.send(`<h2>Phonebook has ${persons.length} contact</h2> <h3>${time}</h3>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (!person) {
        response.status(404).end()
    } else {
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()

})

const getId = () => {
    return (Math.floor(Math.random() * 9999) + 1).toString()
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    const newContact = {
        name: body.name,
        number: body.number,
        id: getId()
    }
    persons = persons.concat(newContact)
    console.log('Persons: ', persons)
    response.json(newContact)
})






