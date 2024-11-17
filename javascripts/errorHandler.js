const errorHandler = (error, request, response, next) => {
  console.log('Error message:', error.message);

  if (error.name === "CaseError") {
    response.status(404).send({ error: 'Could not find person by that id' });
  } else if (error.name === "ValidationError") {
    response.status(404).send({ error: error.message })
  }

  next(error);
}

module.exports = errorHandler;