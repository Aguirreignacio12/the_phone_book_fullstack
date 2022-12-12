const mongoose = require('mongoose')

//url
const url = process.env.MONGODB_URI

//connecting url
mongoose.connect(url).then(() => {
  console.log('Database connected')
}).catch(err => {
  console.error(err)
})
