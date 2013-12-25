var mongoose = require('mongoose');
var express = require('express');
var models = require('./models');
var routes = require('./routes');
var middleware = require('./middleware');
console.log(mongoose.version);

mongoose.connect('mongodb://localhost/nodeblog', function(err){
  if (err) throw err;
  console.log("mongoose connected.");
  var app = express();
  middleware(app);
  routes(app);

  app.listen(3000, function(err){
    console.log("now listen on http://localhost:3000.");
  });
  //mongoose.disconnect();
});
