const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://jdfortune1234:3uCYhRbljEsDOlcL@phonebookcluster.ochzi.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebookCluster`

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (!name && !number) {
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
      console.log(person.name, '-', person.number);
    })
  
    mongoose.connection.close();
  })
} else {
  const person = new Person({
    name,
    number
  });
  
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  })
}

