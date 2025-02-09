const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json()) //json-parseri
app.use(cors())

// If http-method is anything else than POST, morgan logging with morgan('tiny') configuration
app.use((req, res, next) => {
    if (req.method !== 'POST') {
        return morgan('tiny')(req, res, next)
    }
    next()
})

/*** Middleware for logging POST-requests, start ***/
morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

const postLogger = morgan(':method :url :status :response-time :body')
/*** Middleware for logging POST-requests, end ***/

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

//Get all contacts
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

//Get phone book info
app.get('/info', (request, response) => {
    const time = new Date().toUTCString()
    response.send(`<h2>Phone book has ${persons.length} contact</h2> <h3>${time}</h3>`)
})

//Get one contact
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (!person) {
        response.status(404).end()
    } else {
        response.json(person)
    }
})

//Delete contact
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()

})

//Generate random id-number for new contact
const getId = () => {
    return (Math.floor(Math.random() * 9999) + 1).toString()
}

// Add new contact
app.post('/api/persons', postLogger, (request, response) => {
    const body = request.body
    const personsNames = persons.map(person => person.name)
    console.log('Persons names: ', personsNames)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name and/or number missing'
        })
    }
    if (personsNames.includes(body.name)) {
        return response.status(400).json({
            error: 'Name all ready exist in contacts'
        })
    } else {
        const newContact = {
            name: body.name,
            number: body.number,
            id: getId()
        }
        persons = persons.concat(newContact)
        console.log('Persons: ', persons)
        response.json(newContact)
    }
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


