errorsRoute = require('./errors');
loginRoute = require('./login');
postsRoute = require('./posts');

var mongoose = require('mongoose');

var Post = mongoose.model('Post');

module.exports = function(app){
  app.get('/', function(req, res){
    //res.send(200, 'hello mongoose blog.');
    Post.find().sort('created').limit(10).exec(function(err, posts){
      if (err) next(err);
      res.render('home.jade', {'posts': posts});
    });
  });

  // login, logout
  loginRoute(app);

  // posts
  postsRoute(app);

  // 404, 500
  errorsRoute(app);
};
