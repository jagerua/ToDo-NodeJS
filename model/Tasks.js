const mongoose = require('mongoose');

const Tasks = new mongoose.Schema({
  user: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  done: {
    type: Boolean,
    require: true
  },
  updateDate: {
    type: Date
  }
});

module.exports = mongoose.model('Task list', Tasks);