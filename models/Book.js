const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
  title: {type: String, required: true},
  comments: {type: [String], required: false, default: []}
}, {versionKey: false})

module.exports = mongoose.model("Book", bookSchema)