'use strict';
//var eachAsync = require('each-async');
var User = require('../models/user');
var Game = require('../models/game');
var Trade = require('../models/trade');
//var findGameInDB = require('../lib/findGameInDB');
var helpers = require('../lib/helpers');
var _ = require('lodash');
var trade;
var async = require('async');
var getTradeArrayInfo = require('../lib/getTradeArrayInfo');

module.exports = function(app, auth) {

  //add a game to user's outgoing requests list
  app.post('/api/games/outgoingrequests', auth, function(req, res) {
    var gameId = req.body.id;
    var potentialTrades = req.body.gameIdArray;
    //var owner;
    trade = new Trade();

    //if game of game array are undefined, return error
    if (!gameId || potentialTrades.length === 0)
      return helpers.returnError(res, 10, 'game(s) undefined');

    async.waterfall([
      function(callback) {
        //checks to see if wanted game ID is valid
        Game.findById(gameId, function(err, game) {
          //returns if there's an error, the game doesn't exist, or its user's gaem
          if (err || !game || game.owner == req.user._id) {
            callback('invalid id');
          }
          callback(null, game.owner);
        });
      },

      function(owner, callback) {
        //find the user based on the incoming jwt token
        User.findById(req.user._id, function(err, user) {
          if (err) callback('error finding user');
          if (!user) callback('user is null');

          // //check to see if game is already part of a users outgoing requests
          // alreadyWanted = false;
          // for (i = 0; i < user.outgoingRequests.length; i++) {
          //   if (user.outgoingRequests[i].gameId === gameId) {
          //     alreadyWanted = true;
          //   }
          // }

          //if not already on outgoing requests, add to this user's
          //outgoingRequests and add to other user's incoming requests
          //if (!alreadyWanted) {

          trade.outgoing_user = user._id;
          trade.outgoing_user_screenname = user.screenname;
          trade.outgoing_user_email = user.email;
          trade.gameId = gameId;
          trade.potentialTrades = potentialTrades;
          callback(null, owner, user);
        });
      },

      function(owner, user, callback) {
        User.findById(owner, function(err, gameOwner) {
          if (err) callback('error finding owner');
          trade.incoming_user = gameOwner._id;
          trade.incoming_user_screenname = gameOwner.screenname;
          trade.incoming_user_email = gameOwner.email;
          callback(null, user, gameOwner);
        });
      },

      function(user, gameOwner, callback) {
        trade.save(function(err, data) {
          if (err) callback('error finding owner');
          //console.log('data is', data);
          //add to appropriate incoming/outgoing requests
          user.outgoingRequests.push(data._id);
          gameOwner.incomingRequests.push(data._id);

          user.save(function(err) {
            if (err) callback('err saving');
            gameOwner.save(function(err) {
              if (err) callback('err saving');
              callback(null, trade);
            });
          });
        });
      }],

    function(err, result) {
      if (err) return helpers.returnError(res, 10, err);
      return helpers.returnSuccess(res, trade);
    });
  });

  //get all incoming requests
  app.get('/api/games/incomingrequests', auth, function(req, res) {
    //console.log('the restponse', res);
    //find user making the request
    User.findById(req.user._id, function(err, user) {
      if (err) return helpers.returnError(res, 2, 'cannot find user');
      //console.log('requests', user);
      return getTradeArrayInfo(res, user.incomingRequests);

    });
  });

  //get all outgoing requests
  app.get('/api/games/outgoingrequests', auth, function(req, res) {

    //find user making the request
    User.findById(req.user._id, function(err, user) {
      if (err) return helpers.returnError(res, 2, 'cannot find user');

      //return info about the trade
      return getTradeArrayInfo(res, user.outgoingRequests);

    });
  });

  //delete an outgoing request
  app.delete('/api/games/outgoingrequests', auth, function(req, res) {
    var tradeId = req.body.tradeId;
    var ownerId;

    //find this user
    User.findById(req.user._id, function(err, user) {
      if (err) return helpers.returnError(res, 99, 'cannot find user 1');
      if (!user) return helpers.returnError(res, 100, 'user is null');

      user.outgoingRequests = _.remove(user.outgoingRequests, function(item) {
        return (tradeId == item) ? false : true;
      });
      //console.log("monkey", user);
      user.save(function(err) {
        if (err) helpers.returnError(res, 99, 'cannot save user', 400);
        //console.log('it is', tradeId);
        //find the trade obect and delete it, store other user id
        Trade.findById(tradeId, function(err, trade) {
          //console.log('tradidddd', tradeId);
          if (err)
            return helpers.returnError(err, res, 99, 'cannot find user 2');
          ownerId = trade.incoming_user;
          trade.remove(function(err) {
            if (err)
              return helpers.returnError(err, res, 99, 'cannot remove trade');
            //find the user the delete trade was directed at
            User.findById(ownerId, function(err, otherUser) {
              if (err)
                return helpers.returnError(err, res, 99, 'cannot find user 2');
              //console.log('found other user', otherUser, gameId);
              otherUser.incomingRequests = _.remove(otherUser.incomingRequests,
                function(item) {
                  return (tradeId == item) ? false : true;
                });
              //console.log('found other user', otherUser);
              otherUser.save(function(err) {
                if (err)
                  return helpers.returnError(res, 5, 'cannot save user 2', 403);
                helpers.returnSuccess(res);
              });
            });
          });
        });
      });
    });
  });

//delete an incoming request
  app.delete('/api/games/incomingrequests', auth, function(req, res) {
    var tradeId = req.body.tradeId;

    //find this user
    async.waterfall([
      function(callback) {
        User.findById(req.user._id, function(err, user) {
          if (err) return helpers.returnError(res, 99, 'cannot find user 1');
          if (!user) return helpers.returnError(res, 100, 'user is null');
          //console.log('before', user.incomingRequests);
          user.incomingRequests = _.remove(user.incomingRequests, function(item) {
            return (tradeId == item) ? false : true;
          });
          //console.log('after', user.incomingRequests);

          user.save(function(err) {
            if (err) helpers.returnError(res, 99, 'cannot save user', 400);
            callback(null);
          });
        });
      },

      function(callback) {
        //find the trade obect and delete it, store other user id
        Trade.findById(tradeId, function(err, trade) {

          if (err) return helpers.returnError(err, res, 99, 'cannot find trade');
          var ownerId = trade.outgoing_user;
          trade.remove(function(err) {
            if (err)
              return helpers.returnError(err, res, 99, 'cannot remove trade');
            callback(null, ownerId);
          });
        });
      },

      function(ownerId, callback) {
        //find the user the delete trade was directed at
        User.findById(ownerId, function(err, otherUser) {
          if (err)
            return helpers.returnError(err, res, 99, 'cannot find user 2');
          //console.log('before', otherUser.outgoingRequests);
          otherUser.outgoingRequests = _.remove(otherUser.outgoingRequests,
            function(item) {
              return (tradeId == item) ? false : true;
            });
          //console.log('after', otherUser.outgoingRequests);
          otherUser.save(function(err) {
            if (err) return helpers.returnError(res, 5, 'cannot save user 2', 403);
            callback(null); //helpers.returnSuccess(res);
          });
        });
      }],

      function(err) {
        helpers.returnSuccess(res);
      });
  });

};
