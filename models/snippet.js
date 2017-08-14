const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const snippetSchema = new Schema({
  title: {type: String},
  langauge: {type: String},
  tags: {type: String},
  body: {type: String},
  notes: {type: String},
})

const Snippet = mongoose.model('snippet', snippetSchema);

module.exports = Snippet;
