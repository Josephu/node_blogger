var mongoose = require('mongoose');
var User = mongoose.model('User');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

module.exports = function(app){

  app.get('/signup', function(req, res){
    console.log("render signup page");
    res.render('signup.jade');
  });
  
  app.post('/signup', function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;
    var password_confirmation = req.body.password_confirmation;
    var first = req.body.first;
    var last = req.body.last;

    if ( !(email && password) || (password != password_confirmation) ){
      return invalid();
    }

    email = email.toLowerCase();

    User.findById(email, function(err, user){
      if (err) return next(err); //sending err param => lead to error handler

      if (user) {
        return res.render('signup.jade', {exists: true});
      }
      
      crypto.randomBytes(16, function (err, bytes){
        if (err) return next(err);

        var user = {_id: email, name: {first: first, last: last} };
        user.salt = bytes.toString('utf8');
        user.hash = hash(password, user.salt); //TODO: learn how hash and salt works

        User.create(user, function(err, newUser){
          if (err){ 
            if ( err instanceof mongoose.Error.ValidationError ) 
              return invalid();
            else
              return next(err);
          }
        
        req.session.isLoggedIn = true;
        req.session.user = email;
        console.log('create user: %s', email);
        return res.redirect('/');
        });
      });
    });

    function invalid(){
      return res.render('signup.jade', {invalid: true});
    }
  });

  app.get('/login', function(req, res){
    res.render('login.jade');
  });

  app.post('/login', function(req, res){
    var email = cleanString(req.body.email);
    var password = req.body.password;
    if ( !(email && password) ){
      console.log('email or password missing');
      return res.render('login.jade', {invalid: true});      
    }

    User.findById(email, function(err, user){
      if (err) return next(err); //sending err param => lead to error handler

      if ( !(user) ){
        console.log('no such user, email = %s', email);
        return res.render('login.jade', {invalid: true});      
      }
      if (user.hash != hash(password, user.salt) ){
        console.log('password invalid');
        return res.render('login.jade', {invalid: true});      
      }

      req.session.isLoggedIn = true
      req.session.user = email
      console.log('login user: %s', email);
      return res.redirect('/');
    });
  });

  app.get('/logout', function(req, res){
    req.session.isLoggedIn = false
    req.session.user = null
    return res.redirect('/');
  });

}

