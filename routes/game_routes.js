'use strict';
//var eachAsync = require('each-async');
//var User = require('../models/user');
//var Game = require('../models/game');
var returnGamesFromDB = require('../lib/returnGamesFromDB');
//var returnIfError = require('../lib/returnIfError');

module.exports = function(app, auth) {

  //search all available games that are not in current user's inventory
  app.get('/api/search', auth, function(req, res) {
    var searchTerms;
    var games;
    var i;
    var searchJSON = {};

    //read in params into object
    if (req.query.hasOwnProperty('q')) {
      searchTerms = req.query.q.split('%20');
      for (i = 0; i < searchTerms.length; i++) {
        searchTerms[i] = '(?=.*' + searchTerms[i] + ')';
      }
      searchTerms = searchTerms.join('');
      searchJSON.title = new RegExp('' + searchTerms + '', 'i');

    }
    if (req.query.hasOwnProperty('p')) {
      searchJSON.platform = req.query.p;
    }
    if (req.query.hasOwnProperty('z')) {
      searchJSON.zip = req.query.z;
    }
    if (req.query.hasOwnProperty('s')) {
      searchJSON.start = Number(req.query.s);
    }
    if (req.query.hasOwnProperty('r')) {
      searchJSON.radius = req.query.z;
    }

    searchJSON.owner = { $ne: req.user._id };

    //console.log(searchJSON);

    games = returnGamesFromDB(searchJSON, req.user._id, res);

  });
};
  //returns all the user's wanted games
  // app.get('/api/games/mywants', auth, function(req, res) {
  //   var i;
  //   var _id = req.user._id;
  //   var myWants = [];

  //   User.findById(_id, function(err, data) {
  //     if (err) return res.status(400).json({error:7});
  //     eachAsync(data.wantsGames, function(item, index, done) {
  //       //console.log(item, item, index);
  //       Game.find({_id: item.gameId}, function(errGame, dataGame) {
  //           if (errGame) return res.json({error:1});
  //           myWants.push(dataGame[0]);
  //           done(err);
  //         });
  //     },
  //     function(err) {
  //       if (err) return (err);
  //       res.status(200).json({error:0, items: myWants});
  //     }
  //     );
  //   });
  // });

  //returns all the users's games
  // app.get('/api/games/mygames', auth, function(req, res) {
  //   var i;
  //   var _id = req.user._id;
  //   var myGames = [];

  //   User.findById(_id, function(err, data) {
  //     returnIfError(err, res, 7, 'error finding user');

  //     eachAsync(data.hasGames, function(item, index, done) {
  //       Game.find({_id: item}, function(errGame, dataGame) {
  //           if (errGame) return res.status(400).json({error:1});
  //           myGames.push(dataGame[0]);
  //           done();
  //         });
  //     },
  //       function(err) {
  //         returnIfError(err, res, 1, 'error finding games');
  //         res.status(200).json({error:0, items: myGames});
  //       }
  //     );
  //   });
  // });
