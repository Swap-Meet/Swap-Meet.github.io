'use strict';

//passport-http authenticates http requests
//"The HTTP Basic authentication strategy authenticates requests based on
//userid and password credentials contained in the `Authorization` header
//field."
var BasicStrategy = require('passport-http').BasicStrategy;

//require User schema
var User = require('../models/user');

module.exports = function(passport) { //first param is options second is callback
  //passport assumes the request comes in with username and password
  passport.use('basic', new BasicStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    //searches the database to see if email exists
    User.findOne({'basic.email': email}, function(err, user) {
      if (err) return res.status(500).send('server error!');
      if (!user) return done('access error');

      //check to see if password is valid
      if (!user.validPassword(password)) return done('access error');

      return done(null, user);
    });
  }));
};
