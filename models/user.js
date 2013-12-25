var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');

var schema = mongoose.Schema({
  _id: { type: String, lowercase: true, trim: true, validate: validEmail},
  name: {
    first: { type: String, trim: true},
    last: {type: String, trim: true},
  },
  salt: { type: String, require: true},
  hash: { type: String, require: true},
  created: { type: Date, default: Date.now}
});

mongoose.model('User', schema);
