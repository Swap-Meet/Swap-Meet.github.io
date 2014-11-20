'use strict';
var Match = require('../models/match');
var User = require('../models/user');
var Game = require('../models/game');
var findMatchesInDB = require('../lib/findMatchesInDB');

module.exports = function(app, auth) {

  app.get('/api/matches', auth, function(req, res) {

    //console.log(req.user);
    var zip = req.user.zip;
    var matches;

    //find all users in the caller's zip code
    User.find({'zip': zip}, function(err, data) {

      //add error check

      //run findMatches algorithm
      matches = findMatchesInDB(data);
      console.log(matches);
       //return matches object
      res.status(200).json({error:0, 'items': matches});
    });

  });

};