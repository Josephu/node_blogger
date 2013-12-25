var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var loggedIn = require('../middleware/loggedIn');

var cleanString = require('../helpers/cleanString');

module.exports = function(app){
  app.get('/posts/create', loggedIn, function(req, res){
    res.render('posts/create.jade');
  });
  
  app.post('/posts/create', loggedIn, function(req, res, next){
    title = cleanString(req.body.title);
    body = req.body.body;
    author = req.session.user;

    Post.create({title: title, body: body, author: author}, function(err, newPost){
      if (err){ 
        if ( err instanceof mongoose.Error.ValidationError )
          return res.render('posts/create.jade', {invalid: true});
        else
          next(err);
      }
      res.redirect('/posts/'+newPost._id);
    });
  });

  app.get("/posts/:id", function(req, res, next){
    id = req.param('id');
    var query = Post.findById(id).populate('author');
    
    query.exec(function(err, post){
      if (err) return next(err);
      res.render('posts/view.jade', {post: post, can_edit: (req.session.user == post.author.id)});
    });
  });
  
  app.get("/posts/edit/:id", loggedIn, function(req, res, next){
    id = req.param('id');
    Post.findById(id, function(err, post){
      if (err) return next(err);
      res.render('posts/edit.jade', {'post': post});
    });
  });

  app.post("/posts/edit/:id", loggedIn, function(req, res, next){
    id = req.param('id');
    author = req.session.user;
    title = req.body.title;
    body = req.body.body;
    update = {
      $set: {
        'title': title,
        'body': body
      } 
    };
    Post.update({_id: id, author: author}, update, {multi: false}, function(err, num){
      if (err) return next(err);
      if (num === 0) return next(new Error('no post to modify!'));
      console.log('Update '+num+' post.');
      res.redirect('/posts/'+id);
    });
  });
  
  app.get("/posts/delete/:id", loggedIn,  function(req, res, next){
    id = req.param('id');
    author = req.session.user;
    Post.findOne({_id: id, 'author': author}).exec(function(err, post){
      if (err) return next(err);
      if (post === null) return next(new Error('no post to delete!'));
      post.remove();
      console.log('Deleted post '+id);
      res.redirect('/'); //TODO: add error message
    });
  });
};
