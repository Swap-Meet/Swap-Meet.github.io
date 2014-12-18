'use strict';

var User = require('../models/user');
var Game = require('../models/game');
var getGameInfo = require('../lib/getGameInfo');
var _ = require('lodash');
var async = require('async');
var helpers = require('../lib/helpers');

module.exports = function(app, auth) {

  //Remove game from user's inventory
  app.delete('/api/games/inventory', auth, function(req, res) {
    var gameId = req.body.id;
    console.log('gameId to delete', gameId);

    async.parallel([
      //remove the game from the game database
      function(callback) {
        Game.remove({ _id: gameId }, function() {
          //console.log('hi0');
          callback(null);
        });
      },

      //find the user based on the incoming jwt token
      //delete game from their inventory
      function(callback) {
        User.findById(req.user._id, function(err, user) {
          //console.log('hi1', user);
          if (err || !user) callback(null); //return helpers.returnError(res, 9, 'cannot find user');
          //console.log(user.inventory);
          user.inventory = helpers.filterOutGame(user.inventory, gameId);
          //console.log(user.inventory);
          user.save(function() {
            //if (err) return helpers.returnError(res, 10, 'cannot save user');
            callback(null);
          });
        });
      },

      function(callback) {
        //find everyone who has favorited the game, delete game from their favorites
        console.log('gameID:', gameId);
        var counter = 0;
        User.find({favorites: gameId}, function(err, users) {
          if (!users) callback(null);
          console.log('hi2', users);
          if (err || !users) callback(null);
          _.forEach(users, function(user) {
            console.log('fav', user.favorites);
            user.favorites = helpers.filterOutGame(user.favorites, gameId);
            console.log('fav', user.favorites);
            user.save(function() {
              counter++;
              console.log(counter);
              if (counter === users.length) {
                callback(null);
              }
            });

          });
          //callback(null);
        });
      },

      function(callback) {
        var counter = 0;
        //find everyone who has proposed a trade for this game, delete their trades
        User.find({outgoingRequests: {$elemMatch: {gameId: gameId}}},
          //counter++;
          function(err, users) {
          //console.log('hi3', users);
          if (!users) return callback(null);
          //console.log('gameId: ' + gameId);
          //console.log('before', users);
          _.forEach(users, function(user) {
            user.outgoingRequests = _.filter(user.outgoingRequests, function(item) {
              return (item.gameId == gameId) ? false : true;
            });
            //console.log('after', user);
            user.save(function() {
              counter++;
              if (counter === users.length) {
                callback(null);
              }
            });
          });
        });
      },

      function(callback) {
        //find all trades the user has proposed with this game
        //splice out the game, delete if there are no games left in the request
        User.findById(req.user._id, function(err, user) {
          //console.log('hi4');
          if (err || !user) callback(null);
          for (var i = 0; i < user.outgoingRequests.length; i++) {

            user.outgoingrequests[i] = _.filter(user.outgoingrequests[i], function(item) {
              for (var i = 0; i < item.potentialTrades.length; i++) {
                return (item.potentialTrades[i].gameId == gameId) ? false : true;
              }
              //return (item.gameId == gameId) ? false : true;
            });
          }
          user.save(function() {
            callback(null);
          });
        });
      }
      //find all incoming trades for other users, splice out game

      ],

      function() {
        console.log('hi5');
        return helpers.returnSuccess(res);
      });
  });

  // //Remove game from user's list
  // app.delete('/api/games/inventory', auth, function(req, res) {
  //   var gameId = req.body.id;

  //   //remove the game from the game database
  //   Game.remove({ _id: gameId }, function(err) {
  //     if (err) return helpers.returnError(res, 10, 'invalid id');
  //     console.log('removed game document');
  //   });

  //   //async.parallel([deleteGameFromDB(callback)])
  //   //find the user based on the incoming jwt token
  //   //delete game from their inventory

  //   //find everyone who has favorited the game, delete game from their favorites

  //   //find everyone who has proposed a trade for this game, delete their trades

  //   //find all trades the user has proposed with this game
  //   //splice out the game, delete if there are no games left in the request

  //   // User.findById(req.user._id, function(err, user) {
  //   //   returnIfError(err, res, 6, 'error finding user');
  //   //   if (user === null) return res.json({error:6, msg: 'user is null'});

  //   //   //check to see if game is in this user's hasGames
  //   //   var stillHas = true;
  //   //   for (var i = 0; i < user.hasGames.length; i++) {
  //   //     if (user.hasGames[i] === gameId) {
  //   //       user.hasGames.splice(i, 1);
  //   //       stillHas = false;
  //   //       break;
  //   //     }
  //   //   }

  //   //   //delete game from other user's wants games
  //   //   User.find(
  //   //     {wantsGames: {$elemMatch: {gameId: gameId}}}, function(err, data) {
  //   //       if (!data) return res.json({error: 1});
  //   //       for (var i = 0; i < data.length; i++) {
  //   //         for (var j = 0; j < data[i].wantsGames.length; j++) {
  //   //           if (data[i].wantsGames[j].gameId === gameId) {
  //   //             data[i].wantsGames.splice(j, 1);
  //   //             break;
  //   //           }
  //   //         }
  //   //         data[i].save(returnIfError(err, res, 1, 'error saving'));
  //   //       }
  //   //       if (!stillHas) {
  //   //         user.save(function(err) {
  //   //           returnIfError(err, res, 1, 'error saving');
  //   //           res.status(200).json({error: 0}); //updated user
  //   //         });
  //   //       } else {
  //   //         res.json({error: 9, message: 'game not found in user list'});
  //   //       }
  //   //     });
  //   // });
  // });

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
