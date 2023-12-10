require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', function(req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

// Get all
app.get('/api/people', (request, response) => {
    Person.find({}).then(people => response.json(people))
})

// Info
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${Date()}</p>`)
})

// Get single
app.get('/api/people/:id', (req, res) => {
    Person.findById(req.params.id)
    .then(person => res.json(person))
    .catch(error => console.log(`Person with id ${req.params.id} doesn't exist`, error))
})

// Delete
app.delete('/api/people/:id', (req, res) => {
    // const id = Number(req.params.id)
    // persons = persons.filter(p => p.id !== id)
    // res.status(204).end()
})

// Post
app.post('/api/people', (req, res) => {
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

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})