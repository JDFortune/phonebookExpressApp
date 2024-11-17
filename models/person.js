const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

console.log('connecting to', url);

mongoose.connect(url)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(error => console.log('Something when wrong:', error.message));

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    validate: {
      validator: (v) => {
        return /.{3,}/.test(v.trim());
      },
      message: props => `${props.value} must be at least 3 characters long`,
    },
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        return /\d{2,3}-\d+/.test(v);
      },
      message: props => `${props.value} must match XXX-XXX-XXXX format`,
    },
    required: [true, 'Phone number is required'],
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Person', personSchema);