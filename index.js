require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json())
morgan.token('data', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(cors());
app.use(express.static('dist'));

app.get('/info', (request, response) => {
  let date = new Date()
  response.send(
    `<div>
      <p>Phonebook has response for ${persons.length} people</p>
      <p>${date}</p>
    </div>`
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people);
  })
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person);
    })
    .catch(error => {
      response.status(404).json({
        error: 'Person not found',
      });
    });
});

app.delete('/api/persons/:id', (request, response) => {

  let id = request.params.id;

  persons = persons.filter(c => c.id !== id);

  response.status(204).end();
})

function generateId() {
  const id =  persons.length > 0
    ? Math.max(...persons.map(c => Number(c.id)))
    : 0

  return String(id + 1)
}

app.post('/api/persons', (request, response) => {
  let body = request.body;

  if (!body.name || !body.number) {
    return response.status(404).json({
      "error": "missing name or number"
    })
  }

  Person.find({})
    .then(people => {
      if (people.some(c => c.name === body.name)) {
        return response.status(404).json({
          error: 'Names must be unique'
        });
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      });

      person.save().then(newPerson => {
        console.log('New Person Created:', newPerson);
        response.json(newPerson);
      });
    })
  // if (persons.some(c => c.name === body.name)) {
  //   return response.status(404).json({
  //     "error": "person names must be unique",
  //   });
  // }

  // let person = {
  //   id: generateId(),
  //   name: body.name,
  //   number: body.number
  // }

  // persons = persons.concat(person);
  // response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body;
  const id = request.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    Object.assign(person, body);
    response.send(person);
  } else {
    console.log('Something went wrong');
  }
  
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`);