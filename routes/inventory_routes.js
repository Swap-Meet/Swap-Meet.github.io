'use strict';

var User = require('../models/user');
var Game = require('../models/game');
var getGameInfo = require('../lib/getGameInfo');
var _ = require('lodash');
var async = require('async');
var helpers = require('../lib/helpers');
var Trade = require('../models/trade');

module.exports = function(app, auth) {

  //Remove game from user's list
  app.delete('/api/games/inventory', auth, function(req, res) {
    var gameId = req.body.id;

    async.parallel([function(callback) {
      //remove the game from the game database
      Game.remove({ _id: gameId }, function(err) {
        if (err) callback('invalid id');
        //console.log('removed game document');
        callback(null);
      });
    },
    //delete from this user's inventory
    function(callback) {
      User.findById(req.user._id, function(err, user) {
        if (err) callback(err);
        user.inventory = helpers.filterOutGame(user.inventory, gameId);
        user.save(function(err) {
          if (err) callback(err);
          callback(null);
        });
      });
    },
    //delete from everyone who has favorited this game
    function(callback) {
      //find everyone who has favorited the game, delete game from their favorites
      //console.log('gameID:', gameId);
      var counter = 0;
      User.find({favorites: gameId}, function(err, users) {
        if (!users) callback();
        //console.log('hi2', users);
        if (err || !users) callback();
        _.forEach(users, function(user) {
          //console.log('fav', user.favorites);
          user.favorites = helpers.filterOutGame(user.favorites, gameId);

          user.save(function() {
            counter++;
            //console.log('does it output', counter, users);
            if (counter === users.length) {
              callback(null);
            }
          });
        });
      });
    },

    //delete all trades where this game is the main game
    function(callback) {
      //find all trades about gameId
      Trade.find({gameId: gameId}, function(err, trades) {
        async.each(trades, function(trade, done) {
          trade.remove(function(err) {
            if (err) callback(err);
            done();
          });
        }, function(err) {
          if (err) callback(err);
          callback(null);
        });
      });
    },

    //splices from trades where this game is in the list of potential trades
    function(callback) {
      //console.log('these are the trades', gameId);
      Trade.find({potentialTrades: gameId}, function(err, trades) {
        //console.log('these are the trades', trades);
        if (err || !trades) callback('cannot remove trade');
        async.each(trades, function(trade, done) {
          trade.potentialTrades = _.filter(trade.potentialTrades,
            function(item) {
            return (item == gameId) ? false : true;
          });
          trade.save(function(err) {
            if (err) callback(err);
            done();
          });
        }, function(err) {
          if (err) callback(err);
          callback(null);
        });
      });
    }
    ], function(err, results) {
      if (err) return helpers.returnError(res, 55, err);
      return helpers.returnSuccess(res, results);
    });
  });

  //view the users's inventory
  app.get('/api/games/inventory', auth, function(req, res) {
    return getGameInfo(req.user.inventory, res);
  });

  //add a game to user's inventory
  app.post('/api/games/inventory', auth, function(req, res) {
    var newGame = new Game();

    if (req.body.title === '' || req.body.platform === '') {
      helpers.returnError(res, 11, 'title or platform undef', 400);
    }

    //create new game
    //newGame = _.pick(req.body, ['title', 'platform']);
    newGame.title = req.body.title;
    newGame.platform =  req.body.platform;
    newGame.condition = req.body.condition || '';
    newGame.image_urls = req.body.image_urls || [];
    newGame.short_description = req.body.short_description || '';
    newGame.zip = req.user.zip || '';
    newGame.owner_screenname = req.user.screenname;
    newGame.date_added = Date.now();
    newGame.owner = req.user._id;
    //newGame.owner_email = req.user.email;
    //console.log(req.user.owner_email)

    //console.log(newGame);
    //save the new game
    newGame.save(function(err, game) {

      if (err) return helpers.returnError(res, 37, 'cannot save new game', 400);

      //find the current user & push new game's reference ID to hasGames list
      User.findById(req.user._id, function(err, user) {
        if (err) return helpers.returnError(res, 1, 'error finding user');
        if (!user) return helpers.returnError(res, 1, 'cannot find user', 400);

        //add game to user's inventory
        user.inventory.push(game._id);

        user.save(function(err) {
          if (err) return helpers.returnError(res, 1, 'error saving game');
        });
      });
      newGame._id = game._id;
      return helpers.returnSuccess(res, newGame);
    });
  });
};
