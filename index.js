require('dotenv').config()
const express = require('express')
const Contact = require('./models/contact')

const app = express()

const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'))
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

//Get all contacts
app.get('/api/persons', (request, response) => {
    console.log('Response status: ', response.method, response.statusCode)
    Contact.find({}).then(contacts => {
        response.json(contacts)
    })
})

//Get phone book info
app.get('/info', (request, response) => {
    console.log('Response status: ', response.method, response.statusCode)
    const time = new Date().toUTCString()
    response.send(`<h2>Phone book has ${persons.length} contact</h2> <h3>${time}</h3>`)
})

//Get one contact
app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id)
    console.log('ID to find ', request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
    console.log(error.message)
})

//Delete contact
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Contact.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
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
        const newContact = new Contact({
            name: body.name,
            number: body.number,
            id: getId()
        })
        newContact.save().then(savedContact => {
            response.json(savedContact)
        })
    }
})

//Update phone number
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const contact = {
        name: body.name,
        number: body.number
    }
    Contact.findByIdAndUpdate(request.params.id, contact)
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
}
)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Invalid id format' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})