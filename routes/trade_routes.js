'use strict';
//var eachAsync = require('each-async');
var User = require('../models/user');
var Game = require('../models/game');
//var findGameInDB = require('../lib/findGameInDB');
var returnIfError = require('../lib/returnIfError');
//var getGameInfo = require('../lib/getGameInfo');
var _ = require('lodash');
var returnSuccess = require('../lib/returnSuccess');

module.exports = function(app, auth) {

  //delete an incoming request
  app.delete('/api/games/incomingrequests', auth, function(req, res) {
    var gameId = req.body.gameId;
    var ownerId = req.body.ownerId;
    //var i;
    //var counter = 0;
    console.log('route is called');

    //find this user
    User.findById(req.user._id, function(err, user) {
      returnIfError(err, res, 99, 'cannot find user 1');
      if (!user) return res.status(400).json({error: 100, msg: 'user is null'});

      user.incomingRequests = _.remove(user.incomingRequests, function(item) {
        if (gameId == item.gameId) {
          return false;
        }
        return true;
      });

      user.save(function(err) {
        returnIfError(err, res, 99, 'cannot save user', 400);
      });

      //find the user who requested this trade
      User.findById(ownerId, function(err, otherUser) {
        returnIfError(err, res, 99, 'cannot find user 2');
        //console.log('found other user', otherUser, gameId);
        otherUser.outgoingRequests = _.remove(otherUser.outgoingRequests,
          function(item) {
            return (item.gameId == gameId) ? false : true;
          });
        //console.log('found other user', otherUser);
        otherUser.save(function(err) {
          returnIfError(err, res, 5, 'cannot save user 2', 403);
          returnSuccess(res);
        });
      });
      // //find any users who requested to trade this game
      // User.find({outgoingRequests: {$elemMatch: {gameId: gameId}}},
      //   function(err, otherUsers) {
      //     returnIfError(err, res, 99, 'cannot find user 2');
      //     _.forEach(otherUsers, function(otherUser) {
      //       console.log('found other user', otherUser);
      //       otherUser.outgoingRequests = _.remove(otherUser.outgoingRequests,
      //         function(item) return (item.gameId == gameId) ? false : true;
      //     });
      //       console.log('found other user', otherUser);
      //     otherUser.save(function(err) {
      //       returnIfError(err, res, 5, 'cannot save user 2', 403);
      //       counter++;
      //       if (counter === otherUsers.length) {
      //         returnSuccess(res);
      //       }
      //     });
      //   });
      // });
    });
  });

  //add a game to user's outgoing requests list
  app.post('/api/games/outgoingrequests', auth, function(req, res) {
    var gameId = req.body.id;
    var potentialTrades = req.body.gameIdArray;
    //console.log(gameId, potentialTrades);
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
          // console.log(user);
          // console.log(user.outgoingRequests[0].potentialTrades);

          user.save(function(err) {
            returnIfError(err, res, 1, 'error saving');

            //find owner of other game
            User.findById(owner, function(err, gameOwner) {
              returnIfError(err, res, 1, 'error finding owner');

              //add this request as an incoming request
              gameOwner.incomingRequests.push({
                gameId: gameId,
                ownerId: user._id,
                potentialTrades: potentialTrades
              });

              //save the other user
              gameOwner.save(function(err) {
                returnIfError(err, res, 453, 'err saving user');
                return res.status(200).json({error:0}); //updated user
              });
            });
          });
        }
        else {
          return res.json({error: 8, msg: 'game already in favorites'});
        }
      });
    });
  });

  //get all incoming requests
  app.get('/api/games/incomingrequests', auth, function(req, res) {
    //var user = req.user._id;
    var incomingRequests = [];
    var counter = 0;
    var numRequests = 0;

    //find user making the request
    User.findById(req.user._id, function(err, user) {
      returnIfError(err, res, 2, 'cannot find user');

      //console.log('array', user.incomingRequests);
      numRequests = _.reduce(user.incomingRequests, function(numRequests, num) {
        //console.log('pooooo');
        return numRequests + num.potentialTrades.length;
      }, numRequests);
      //numRequests = user.incomingRequests.length;
      //console.log('num requests', numRequests);

      _.forEach(user.incomingRequests, function(incomingRequest) {
        returnIfError(err, res, 33, 'cannot find request');
        _.forEach(incomingRequest.potentialTrades, function(item) {
          Game.findById(item, function(err, game) {
            if (err) return res.status(400).json({error: 99});
            incomingRequests.push(_.pick(game,
              ['_id', 'owner', 'title', 'image_url', 'platform']));
            counter++;
            //console.log('incomingRequests', incomingRequests);
            if (counter === numRequests) {
              return res.status(200).json({error: 0, items: incomingRequests});
            }
          });
        });
      });
    });
  });

  //delete an outgoing request
  app.delete('/api/games/outgoingrequests', auth, function(req, res) {
    var gameId = req.body.gameId;
    var ownerId = req.body.ownerId;
    //var i;
    //var counter = 0;
    console.log('route is called');

    //find this user
    User.findById(req.user._id, function(err, user) {
      returnIfError(err, res, 99, 'cannot find user 1');
      if (!user) return res.status(400).json({error: 100, msg: 'user is null'});

      user.outgoingRequests = _.remove(user.outgoingRequests, function(item) {
        if (gameId == item.gameId) {
          return false;
        }
        return true;
      });

      user.save(function(err) {
        returnIfError(err, res, 99, 'cannot save user', 400);
      });

      //find the user the delete trade was directed at
      User.findById(ownerId, function(err, otherUser) {
        returnIfError(err, res, 99, 'cannot find user 2');
        //console.log('found other user', otherUser, gameId);
        otherUser.incomingRequests = _.remove(otherUser.incomingRequests,
          function(item) {
            return (item.gameId == gameId) ? false : true;
          });
        //console.log('found other user', otherUser);
        otherUser.save(function(err) {
          returnIfError(err, res, 5, 'cannot save user 2', 403);
          returnSuccess(res);
        });
      });
      // //find any users who requested to trade this game
      // User.find({outgoingRequests: {$elemMatch: {gameId: gameId}}},
      //   function(err, otherUsers) {
      //     returnIfError(err, res, 99, 'cannot find user 2');
      //     _.forEach(otherUsers, function(otherUser) {
      //       console.log('found other user', otherUser);
      //       otherUser.outgoingRequests = _.remove(otherUser.outgoingRequests,
      //         function(item) return (item.gameId == gameId) ? false : true;
      //     });
      //       console.log('found other user', otherUser);
      //     otherUser.save(function(err) {
      //       returnIfError(err, res, 5, 'cannot save user 2', 403);
      //       counter++;
      //       if (counter === otherUsers.length) {
      //         returnSuccess(res);
      //       }
      //     });
      //   });
      // });
    });
  });
};
