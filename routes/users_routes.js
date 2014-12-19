'use strict';

var User = require('../models/user');
//var Game = require('../models/game');
var helpers = require('../lib/helpers');
var _ = require('lodash');

module.exports = function(app, auth) {

  //previous user gets jwt token
  app.get('/api/user', function(req, res) {
    var profile = {};
    var email = req.query.email;
    var password = req.query.password;

    //look for a user with this email in the DB
    User.findOne({email: email}, function(err, user) {
      if (err) return helpers.returnError(res, 1, 'cannot find user');
      if (!user) return helpers.returnError(res, 6, 'user not defined');

      //access is denied for invalid password
      if (!user.validPassword(password))
        return helpers.returnError(res, 4, 'invalid password', 404);

      //pull profile infomation from the DB
      profile = _.pick(user, ['email', 'screenname', 'zip', 'avatar_url']);

      //return profile info to user
      return res.status(200).json({
        error: 0,
        jwt: user.generateToken(app.get('jwtSecret')),
        profile: profile
      });
    });
  });

  //creating a new user
  app.post('/api/user', function(req, res) {
    var profile = {};
    var password = req.query.password;
    var zip = req.query.zip;
    var email = req.query.email;
    var screenname = req.query.screenname;

    if (!password || !zip || !email || !screenname)
      return helpers.returnError(res, 7, 'missing field');

    User.findOne({email: email}, function(err, user) {
      if (err) return helpers.returnError(err, res, 1, 'cannot find user', 400);

      if (user) return helpers.returnError(res, 2, 'user already exists');
      //return res.status(400).json({error: 2});

      if (req.body.password && (req.body.password === req.body.email)) {
        return res.status(400).json({error:3});
      }

      //password pattern: any 8-12 character length combo of ASCII
      //with at least one number and one letter
      var passwordPattern = /^(?=.*\d+)(?=.*[a-z A-Z])[ -~]{8,12}$/;
      if (!passwordPattern.test(password)) {
        return res.status(400).json({error: 4});
      }

      var newUser = new User();
      newUser.email = req.query.email;
      newUser.password = newUser.generateHash(password);
      newUser.screenname = req.query.screenname;
      newUser.zip = zip;
      newUser.favorites = [];
      newUser.incomingRequests = [];
      newUser.outgoingRequests = [];
      newUser.latitude = '';
      newUser.longitude = '';

      profile.email = newUser.email;
      profile.screename = newUser.screenname || '';
      profile.zip = newUser.zip || '';
      profile.avatar_url = newUser.avatar_url || '';

      newUser.save(function(err) {
        if (err) return res.status(400).json({error: 1});
        return res.status(200).json({
          error:0,
          jwt: newUser.generateToken(app.get('jwtSecret')),
          profile: profile
        });
      });
    });
  });

  //get user profile upon sending jwt token
  app.get('/api/user/myprofile', auth, function(req, res) {
    var profile = {};
    User.findById(req.user._id, function(err, myInfo) {
      if (err) return res.status(400).json({error:1});

      profile = _.pick(myInfo, ['email', 'screenname', 'zip', 'avatar_url']);

      return res.status(200).json({
        error: 0,
        profile: profile
      });
    });

  });

  //allow user to update avatar_url upon sending jwt token, returns profile info
  app.put('/api/user/myprofile', auth, function(req, res) {
    var passback = {};
    console.log('body is', req.body);
    User.findById(req.user._id, function(err, user) {
      if (err) return helpers.returnError(res, 1, 'cannot find user');

      user.avatar_url = req.body.avatar_url || '';
      user.email = req.body.email || user.email;
      user.screename = req.body.screenname || user.screenname || '';

      //updating zip code needs to change lat/long
      user.zip = req.body.zip || user.zip || '';
      //console.log(user);
      passback.email = req.body.email || user.email;
      passback.screename = req.body.screenname || user.screenname || '';
      passback.zip = req.body.zip || user.zip || '';
      passback.avatar_url = req.body.avatar_url || '';

      user.save(function(err) {
        if (err) return helpers.returnError(res, 1, 'cannot save user');
      });
      return res.status(200).json({error: 0, profile:passback});
    });
  });
};
