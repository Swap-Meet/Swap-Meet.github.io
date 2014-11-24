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

        var returnMatches = {};
        var returnMatch = [];

        //compensate for adjustment from algorithm providing multiple matches
        //to just one match
        matches = matches[0][0];

        //there are no matches
        if (!matches) return res.status(200).json({error:0, items: []});

        //find the game in the array
        Game.find({_id: matches.yourgame[0].gameId}, function(err, game) {

          matches.yourgame[0] = game;

          //create new object to return
          returnMatches.yourgame = matches.yourgame[0][0];
          returnMatches.mygame = matches.mygame[0];
          returnMatches.me = {_id: matches.me};
          returnMatches.you = matches.you[0];
          returnMatch = [returnMatches];

          res.status(200).json({error: 0, items: returnMatch});
        });
      }
    );
  });
};
