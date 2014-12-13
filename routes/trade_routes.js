'use strict';
var eachAsync = require('each-async');
var User = require('../models/user');
var Game = require('../models/game');
//var findGameInDB = require('../lib/findGameInDB');
var returnIfError = require('../lib/returnIfError');
var getGameInfo = require('../lib/getGameInfo');

module.exports = function(app, auth) {

  //add a game to user's outgoing requests list
  app.post('/api/games/outgoingrequests', auth, function(req, res) {
    var gameId = req.body.id;
    var potentialTrades = req.body.gameIdArray;
    var owner;
    var alreadyWanted;
    var i;

    //checks to see if game ID is valid
    Game.findById(gameId, function(err, game) {
      returnIfError(err, res, 10, 'invalid id');
      //if (game)
      owner = game.owner;

      //find the user based on the incoming jwt token
      User.findById(req.user._id, function(err, user) {
        returnIfError(err, res, 6, 'error finding user');
        if (!user) return res.json({error:6, msg: 'user is null'});

        //check to see if game is already in this user's wantsgames
        alreadyWanted = false;
        for (i = 0; i < user.outgoingRequests.length; i++) {
          if (user.outgoingRequests[i].gameId === gameId) {
            alreadyWanted = true;
          }
        }

        //if not already on outgoing requests, add to this user's
        //outgoingRequests and add to other user's incoming requests
        if (!alreadyWanted) {
          user.outgoingRequests.push({
            gameId: gameId,
            ownerId: owner,
            potentialTrades: potentialTrades
          });

          user.save(function(err) {
            returnIfError(err, res, 1, 'error saving');

            //find owner of other game
            User.findById(owner, function(err, gameOwner) {
              returnIfError(err, res, 1, 'error finding owner');
              gameOwner.incomingRequests.push({
                gameId: gameId,
                ownerId: user._id,
                potentialTrades: potentialTrades
              });
              res.status(200).json({error:0}); //updated user
            });
          });
        }
        else {
          res.json({error: 8, msg: 'game already in favorites'});
        }
      });
    });
  });

  //get all incoming requests
  app.get('/api/games/incomingrequests', auth, function(req, res) {
    //var user = req.user._id;
    var incomingRequests = [];

    //find user making the request
    User.findById(req.user._id, function(err, user) {
      returnIfError(err, res, 2, 'cannot find user');

      //cycles through each of that user's incoming requests
      eachAsync(user.incomingRequests, function(item) {
        //looks up info about each incoming request
        incomingRequests.push({
          gameId: item.gameId,
          ownerId: item.ownerId,
          potentialTrades: getGameInfo(item.potentialTrades)
        });
      }, function(err) {
        returnIfError(err, res, 1, 'cannot cycle through games');
        return res.status(200).json({error: 0, items: incomingRequests || []});
      });
    });
  });

  //remove a game from user's wantsGames list
  /*app.delete('/api/games/wantsgames', auth, function(req, res) {
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
          if (err) return res.json({error: 1, msg: 'error saving to user
          wantsGames'});
          res.status(200).json({error: 0}); //updated user
        });
      } else {
        res.json({error: 9, msg: 'game not found in user list'});
      }
    });
  });*/
};
