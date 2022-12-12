const { response } = require("express")

const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' })
  }
  else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  else {
    response.status(500).end()
  }
  next(err)
}
module.exports = errorHandler