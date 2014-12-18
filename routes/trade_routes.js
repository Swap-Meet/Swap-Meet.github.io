'use strict';
//var eachAsync = require('each-async');
var User = require('../models/user');
var Game = require('../models/game');
//var findGameInDB = require('../lib/findGameInDB');
var helpers = require('../lib/helpers');
var _ = require('lodash');
//var async = require('async');

module.exports = function(app, auth) {

  //add a game to user's outgoing requests list
  app.post('/api/games/outgoingrequests', auth, function(req, res) {
    var gameId = req.body.id;
    var potentialTrades = req.body.gameIdArray;
    //console.log(gameId, potentialTrades);
    var owner;
    var alreadyWanted;
    var i;

    //console.log('output', gameId, potentialTrades);
    //if game of game array are undefined, return error
    if (!gameId || potentialTrades.length === 0)
      return helpers.returnError(res, 10, 'game(s) undefined');

    //checks to see if game ID is valid
    Game.findById(gameId, function(err, game) {
      //console.log('gameid', gameId, game.owner, req.user._id);
      if (err || !game || game.owner == req.user._id) {

        return helpers.returnError(res, 10, 'invalid id');
      }//else {
      owner = game.owner;

      //find the user based on the incoming jwt token
      User.findById(req.user._id, function(err, user) {
        if (err) return helpers.returnError(res, 6, 'error finding user');
        if (!user) return helpers.returnError(res, 6, 'user is null');

        //check to see if game is already part of a users outgoing requests
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
            if (err) return helpers.returnError(res, 1, 'error saving');
            //console.log('other user', user);
            //find owner of other game
            User.findById(owner, function(err, gameOwner) {
              if (err) return helpers.returnError(res, 1, 'error finding owner');

              //add this request as an incoming request
              gameOwner.incomingRequests.push({
                gameId: gameId,
                ownerId: user._id,
                potentialTrades: potentialTrades
              });

              //save the other user
              gameOwner.save(function(err) {
                if (err) return helpers.returnError(res, 453, 'err saving user');
                return helpers.returnSuccess(res);
              });
            });
          });
        }
        else {
          return helpers.returnError(res, 8, 'game already part of trade', 400);
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
      if (err) return helpers.returnError(res, 2, 'cannot find user');
      console.log('user', user);
      console.log('array', user.incomingRequests);
      numRequests = _.reduce(user.incomingRequests, function(numRequests, num) {
        //console.log('pooooo');
        return numRequests + num.potentialTrades.length;
      }, numRequests);

      _.forEach(user.incomingRequests, function(incomingRequest) {

        if (err) return helpers.returnError(res, 33, 'cannot find request');

        _.forEach(incomingRequest.potentialTrades, function(item) {

          Game.findById(item, function(err, game) {
            if (err) return helpers.returnError(res, 99);
            //console.log('game', game);
            incomingRequests.push({owner: game.owner, gameId: game._id, games: _.pick(game,
              ['_id', 'title', 'zip', 'owner', 'owner_screenname',
                'date_added', 'short_description', 'platform', 'owner',
                'image_urls'])});
            //console.log('incomingrequests', incomingRequests);
            counter++;
            //console.log('incomingRequests', incomingRequests);
            if (counter === numRequests) {
              return helpers.returnSuccess(res, incomingRequests);
              //return res.status(200).json({error: 0, items: incomingRequests});
            }
          });
        });
      });
    });
  });

  //get all outgoing requests
  app.get('/api/games/outgoingrequests', auth, function(req, res) {

    var outgoingRequests = [];
    var counter = 0;
    var numRequests = 0;

    //find user making the request
    User.findById(req.user._id, function(err, user) {
      if (err) return helpers.returnError(res, 2, 'cannot find user');
      //console.log('user', user);
      //console.log('array', user.incomingRequests);
      numRequests = _.reduce(user.outgoingRequests, function(numRequests, num) {
        //console.log('pooooo');
        return numRequests + num.potentialTrades.length;
      }, numRequests);

      if (numRequests === 0) return helpers.returnSuccess(res);
      _.forEach(user.outgoingRequests, function(outgoingRequest) {

        if (err) return helpers.returnError(res, 33, 'cannot find request');

        _.forEach(outgoingRequest.potentialTrades, function(item) {

          Game.findById(item, function(err, game) {
            if (err) return helpers.returnError(res, 99);
            //console.log('game', game);
            outgoingRequests.push({owner: game.owner, gameId: game._id, games: _.pick(game,
              ['_id', 'title', 'zip', 'owner', 'owner_screenname',
                'date_added', 'short_description', 'platform', 'owner',
                'image_urls'])});
            //console.log('outgoingRequests', outgoingRequests);
            counter++;
            //console.log(counter, numRequests);
            if (counter === numRequests) {
              return helpers.returnSuccess(res, outgoingRequests);
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
      if (err) return helpers.returnError(res, 99, 'cannot find user 1');
      if (!user) return helpers.returnError(res, 100, 'user is null');
      //if (!user) return res.status(400).json({error: 100, msg: 'user is null'});

      user.outgoingRequests = _.remove(user.outgoingRequests, function(item) {
        return (gameId == item.gameId) ? false : true;
      });

      user.save(function(err) {
        if (err) helpers.returnError(res, 99, 'cannot save user', 400);
      });

      //find the user the delete trade was directed at
      User.findById(ownerId, function(err, otherUser) {
        if (err) return helpers.returnError(err, res, 99, 'cannot find user 2');
        //console.log('found other user', otherUser, gameId);
        otherUser.incomingRequests = _.remove(otherUser.incomingRequests,
          function(item) {
            return (item.gameId == gameId) ? false : true;
          });
        //console.log('found other user', otherUser);
        otherUser.save(function(err) {
          if (err) return helpers.returnError(res, 5, 'cannot save user 2', 403);
          helpers.returnSuccess(res);
        });
      });
    });
  });

  //delete an incoming request
  app.delete('/api/games/incomingrequests', auth, function(req, res) {
    var gameId = req.body.gameId;
    var ownerId = req.body.ownerId;

    console.log('route is called');

    //find this user
    User.findById(req.user._id, function(err, user) {
      if (err) return helpers.returnError(res, 99, 'cannot find user 1');
      if (!user) return helpers.returnError(res, 100, 'user is null');
      //console.log(user.incomingRequests, gameId);
      user.incomingRequests = _.remove(user.incomingRequests, function(item) {
        return (gameId == item.gameId) ? false : true;
      });
      //console.log(user.incomingRequests);
      user.save(function(err) {
        if (err) helpers.returnError(res, 99, 'cannot save user', 400);

        //find the user the delete trade was directed at
        User.findById(ownerId, function(err, otherUser) {
          if (err || !otherUser) return helpers.returnError(err, res, 99, 'cannot find user 2');
          //console.log('found other user', otherUser, gameId);
          otherUser.outgoingRequests = _.remove(otherUser.outgoingRequests,
            function(item) {
              return (item.gameId == gameId) ? false : true;
            });
          //console.log('found other user', otherUser);
          otherUser.save(function(err) {
            if (err) return helpers.returnError(res, 5, 'cannot save user 2', 403);
            helpers.returnSuccess(res);
          });
        });
      });
    });
  });
};
