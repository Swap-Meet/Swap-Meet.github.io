'use strict';
var eachAsync = require('each-async');
var User = require('../models/user');
var Game = require('../models/game');
var findGameInDB = require('../lib/findGameInDB');
var returnIfError = require('../lib/returnIfError');

module.exports = function(app, auth) {

 //add a game to user's outgoing requests list
  app.post('/api/games/wantsgames', auth, function(req, res) {
    var gameId = req.body.id;
    var owner;
    var alreadyWanted;
    var i;
    //checks to see if game ID is valid
    Game.findById(gameId, function(err, game) {
      if (err) return res.json({error: 10, msg: 'invalid id'});
      if (game) owner = game.owner;
    });

    //find the user based on the incoming jwt token
    User.findById(req.user._id, function(err, user) {
      if (err) return res.json({error: 6, msg: 'error finding user'});
      if (user === null) return res.json({error:6, msg: 'user is null'});

      //check to see if game is already in this user's wantsgames
      alreadyWanted = false;
      for (i = 0; i < user.wantsGames.length; i++) {
        if (user.wantsGames[i].gameId == gameId) {
          alreadyWanted = true;
        }
      }

      //if not already wanted, add to wantsgames
      if (!alreadyWanted) {
        user.wantsGames.push({gameId: gameId, ownerId: owner});
        console.log(user.wantsGames);
        user.save(function(err) {
          if (err) return res.json({error: 1, msg: 'error saving to user wantsGames'});
          res.status(200).json({error:0}); //updated user
        });
      }
      else {
        res.json({error: 8, msg: 'game already in favorites'});
      }
    });

  });

  //remove a game from user's wantsGames list
  app.delete('/api/games/wantsgames', auth, function(req, res) {
    var gameId = req.body.id;

    //checks to see if game ID is valid
    Game.findById(gameId, function(err, game) {
      if (err) return res.json({error:10, msg:'invalid id'});
    });

    //find the user based on the incoming jwt token
    User.findById(req.user._id, function(err, user) {
      if (err) return res.json({error: 6, msg: 'error finding user'});
      if (user === null) return res.json({error: 6, msg: 'user is null'});

      //check to see if game is in this user's wantsGames
      var stillWants = true;
      for (var i = 0; i < user.wantsGames.length; i++) {
        if (user.wantsGames[i].gameId == gameId) {
          user.wantsGames.splice(i, 1);
          stillWants = false;
          break;
        }
      }

      if (!stillWants) {
        user.save(function(err) {
          if (err) return res.json({error: 1, msg: 'error saving to user wantsGames'});
          res.status(200).json({error: 0}); //updated user
        });
      } else {
        res.json({error: 9, msg: 'game not found in user list'});
      }
    });
  });
};
