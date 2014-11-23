'use strict';
var Match = require('../models/match');
var User = require('../models/user');
var Game = require('../models/game');
var findMatchesInDB = require('../lib/findMatchesInDB');
var async = require('async');

module.exports = function(app, auth) {

  app.get('/api/matches', auth, function(req, res) {

    var zip = req.user.zip;

    //run finding matches and returning data is series
    async.series([
      function(done) {
        var matches;
        User.find({zip: zip}, function(err, data) {

          //throws error to callback function
          if (err) {done(err);}

          //run findMatches algorithm
          findMatchesInDB(req.user, data, res, function(err, data) {
            done(err, data);
          });
        });
      }],
      function(err, matches) {
        if (err) return res.status(400).json({error: 1});

        matches = matches[0][0];
        if (!matches) return res.status(200).json({error:0, items: []});

        console.log('match0', matches.mygame[0].gameId);
        Game.find({_id: matches.yourgame[0].gameId}, function(err, g) {

          matches.yourgame[0] = g;

          var returnMatches = {};
          returnMatches.yourgame = matches.yourgame[0][0];
          returnMatches.mygame = matches.mygame[0];
          returnMatches.me = {_id: matches.me};
          returnMatches.you = matches.you[0];
          var returnMatch = [returnMatches];

          res.status(200).json({error: 0, items: returnMatch});
        });
      }
    );
  });
};
