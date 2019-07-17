const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: Object,
    required: true
  },
  released: {
    type: Number,
    required: true
  },
  cast: {
    role: {
      type: String
    },
    actor: {
      type: Object,
      required: true
    }
  }
});

module.exports = mongoose.model('Film', filmSchema);