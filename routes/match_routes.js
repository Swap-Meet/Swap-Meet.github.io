'use strict';
var Match = require('../models/match');
var User = require('../models/user');
var Game = require('../models/game');
var findMatchesInDB = require('../lib/findMatchesInDB');
var async = require('async');

module.exports = function(app, auth) {

  app.get('/api/matches', auth, function(req, res) {

      var zip = req.user.zip;

    async.series([
      function(done){

        var matches;
        User.find({'zip': zip}, function(err, data) {

       if (err) { done(err)}
          //run findMatches algorithm
          findMatchesInDB(req.user, data, res, function(err, data){
            done(err, data);
          });
        });
      }],
      function(err, matches){
        if (err) console.log('hi2');
        console.log('cat', matches[0][0]);
        if (!matches[0][0]) return res.status(200).json({'error':0, items: []});
        //console.log(matches[0]);
        //console.dir(matches[0][0].user1game);
        console.log('match0', matches[0][0].mygame[0].gameId);
          Game.find({'_id': matches[0][0].yourgame[0].gameId}, function(err, g){
            console.log('game', g);
            //var local = i;
            //match.user1game.push(g);
            matches[0][0].yourgame[0] = g;

            var returnMatches = {};
            returnMatches.yourgame = matches[0][0].yourgame[0];
            returnMatches.mygame = matches[0][0].mygame[0];
            console.log("me", matches[0][0].me);
            console.log("you", matches[0][0].me);
            returnMatches.me = matches[0][0].me;
            returnMatches.you = matches.you;

            res.status(200).json({error: 0, items: returnMatches});
          });
        //res.status(200).json({error: 0, items: matches});
      }
    );


  });
};