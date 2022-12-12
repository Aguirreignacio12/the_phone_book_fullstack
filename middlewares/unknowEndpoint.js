const unknowEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
module.exports = unknowEndpoint