'use strict';
var Match = require('../models/match');
var User = require('../models/user');
var Game = require('../models/game');
var findMatchesInDB = require('../lib/findMatchesInDB');
var async = require('async');

module.exports = function(app, auth) {

  app.get('/api/matches', auth, function(req, res) {

  //   //console.log(req.user);
  //   var zip = req.user.zip;
  //   var matches;

  //   //find all users in the caller's zip code
  //   User.find({'zip': zip}, function(err, data) {

  //     //add error check

  //     //run findMatches algorithm
  //     matches = findMatchesInDB(data, res);

  //      //return matches object
  //     console.log('most recent matches', matches);
  //     res.status(200).json({error:0, 'items': matches});
  //     //setTimeout(function(matches){res.status(200).json({error:0, 'items': matches});}, 3000)

  //   });

  // });
      var zip = req.user.zip;

    async.series([
      function(done){

        var matches;
        User.find({'zip': zip}, function(err, data) {

       if (err) {console.log("hi"); done(err)}

      //run findMatches algorithm
          findMatchesInDB(data, res, function(err, data){
            done(err, data);
          });

       //return matches object
          //console.log('most recent matches', matches);
      //res.status(200).json({error:0, 'items': matches});
      //setTimeout(function(matches){res.status(200).json({error:0, 'items': matches});}, 3000)
          //done(null, matches);
        });

      }],
      function(err, matches){
        if (err) console.log('hi2');
        console.log(matches[0]);
        console.dir(matches[0][0].user1game);
        res.status(200).json({error: 0, items: matches[0]});
      }
    );
  });
};