const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

let contacts = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json())
morgan.token('data', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(cors());
app.use(express.static('dist'));

// app.get('/favicon.ico', (req, res) => {})

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>');
})

app.get('/info', (request, response) => {
  let date = new Date()
  response.send(
    `<div>
      <p>Phonebook has response for ${contacts.length} people</p>
      <p>${date}</p>
    </div>`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(contacts);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = contacts.find(p => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.delete('/api/persons/:id', (request, response) => {
  let id = request.params.id;

  contacts = contacts.filter(c => c.id !== id);

  response.status(204).end();
})

function generateId() {
  const id =  contacts.length > 0
    ? Math.max(...contacts.map(c => Number(c.id)))
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

  if (contacts.some(c => c.name === body.name)) {
    return response.status(404).json({
      "error": "contact names must be unique",
    });
  }

  let contact = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  contacts = contacts.concat(contact);
  response.json(contact)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`);