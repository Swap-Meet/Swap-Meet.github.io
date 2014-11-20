'use strict';
var Match = require('../models/match');
var User = require('../models/user');
var Game = require('../models/game');
var findMatches = require('../lib/findMatches');

module.exports = function(app, auth) {

  app.get('/api/matches', auth, function() {

    var zip = req.body.zip;
    var matches;

    //find all users in the caller's zip code
    User.find({'zip': zip}, function(err, data) {

      //run findMatches algorithm
      matches = findMatches(data);

       //return matches object
      res.status(200).json({error:0, 'items': matches});
    });

  });

};