require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

// Get all
app.get('/api/people', (request, response) => {
    Person.find({}).then(people => response.json(people))
})

// Info
app.get('/info', (request, response) => {
    Person.find({})
        .then(people => response.send(`<p>Phonebook has info for ${people.length} people</p> <p>${Date()}</p>`))
})

// Get single
app.get('/api/people/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) res.json(person)
            else res.status(404).end()
        })
        .catch(error => next(error))
})

// Delete
app.delete('/api/people/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => res.status(204).end())
        .catch(error => next(error))
})

// Post
app.post('/api/people', (req, res, next) => {
    const body = req.body

    // if (!body.name || !body.number) {
    //     return res.status(400).json({
    //         error: 'name or number missing'
    //     })
    // } 
    // else if(Person.find({ name: body.name })) {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        phone: body.number,
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

// Put
app.put('/api/people/:id', (req, res, next) => {
    const { name, phone } = req.body

    Person.findByIdAndUpdate(
        req.params.id,
        { name, phone },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))
})

// Unknown endpoint
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error handler
const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
    else if (error.name === 'ValidationError') return res.status(400).send({ error: error.message })

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})