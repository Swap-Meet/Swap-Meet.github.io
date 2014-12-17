'use strict';
//var eachAsync = require('each-async');
var User = require('../models/user');
var Game = require('../models/game');
//var findGameInDB = require('../lib/findGameInDB');
var helpers = require('../lib/helpers');
var _ = require('lodash');

module.exports = function(app, auth) {

 //Remove game from user's list
  app.delete('/api/games/inventory', auth, function(req, res) {
    var gameId = req.body.id;

    //remove the game from the game database
    Game.remove({ _id: gameId }, function(err) {
      if (err) return helpers.returnError(res, 10, 'invalid id');
      console.log('removed game document');
    });

    //async.parallel([deleteGameFromDB(callback)])

    //find the user based on the incoming jwt token
    //delete game from their inventory
    User.findById(req.user._id, function(err, user) {
      if (err || !user) return helpers.returnError(res, 9, 'cannot find user');
      user.inventory = helpers.filterOutGame(user.inventory, gameId);
      user.save(function(err) {
        if (err) return helpers.returnError(res, 10, 'cannot save user');
      });
    });

    //find everyone who has favorited the game, delete game from their favorites
    User.find({favorites: {$elemMatch: {gameId: gameId}}}, function(err, users) {
      if (err) return helpers.returnError(res, 10, 'error finding user');

      _.forEach(users, function(user) {
        user.favorites = helpers.filterOutGame(user.favorites, gameId);
      });
    });

    //find everyone who has proposed a trade for this game, delete their trades
    User.find({outgoingrequests: {$elemMatch: {gameId: gameId}}}, function(err, user) {
      console.log('user: ' + user);

    });

    //find all trades the user has proposed with this game
    //splice out the game, delete if there are no games left in the request
    User.findById(req.user._id, function(err, user) {
      if (err || !user) return helpers.returnError(res, 9, 'cannot find user');
      user.outgoingrequests = _.filter(user.outgoingrequests, function(item) {
        return (item.gameId == gameId) ? false : true;
      });
    });

    // User.findById(req.user._id, function(err, user) {
    //   returnIfError(err, res, 6, 'error finding user');
    //   if (user === null) return res.json({error:6, msg: 'user is null'});

    //   //check to see if game is in this user's hasGames
    //   var stillHas = true;
    //   for (var i = 0; i < user.hasGames.length; i++) {
    //     if (user.hasGames[i] === gameId) {
    //       user.hasGames.splice(i, 1);
    //       stillHas = false;
    //       break;
    //     }
    //   }

    //   //delete game from other user's wants games
    //   User.find(
    //     {wantsGames: {$elemMatch: {gameId: gameId}}}, function(err, data) {
    //       if (!data) return res.json({error: 1});
    //       for (var i = 0; i < data.length; i++) {
    //         for (var j = 0; j < data[i].wantsGames.length; j++) {
    //           if (data[i].wantsGames[j].gameId === gameId) {
    //             data[i].wantsGames.splice(j, 1);
    //             break;
    //           }
    //         }
    //         data[i].save(returnIfError(err, res, 1, 'error saving'));
    //       }
    //       if (!stillHas) {
    //         user.save(function(err) {
    //           returnIfError(err, res, 1, 'error saving');
    //           res.status(200).json({error: 0}); //updated user
    //         });
    //       } else {
    //         res.json({error: 9, message: 'game not found in user list'});
    //       }
    //     });
    // });
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
      if (err) return helpers.returnError(res, 10, 'invalid id');
      //if (game)
      owner = game.owner;

      //find the user based on the incoming jwt token
      User.findById(req.user._id, function(err, user) {
        if (err) return helpers.returnError(res, 6, 'error finding user');
        if (!user) return helpers.returnError(res, 6, 'user is null');

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
            if (err) return helpers.returnError(res, 1, 'error saving');

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
                //res.status(200).json({error:0}); //updated user
              });
            });
          });
        }
        else {
          return helpers.returnError(res, 8, 'game already in favs', 400);
          //res.json({error: 8, msg: 'game already in favorites'});
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
            console.log('game', game);
            incomingRequests.push({owner: game.owner, gameId: game._id, games: _.pick(game,
              ['_id', 'title', 'zip', 'owner', 'owner_screenname',
                'date_added', 'short_description', 'platform', 'owner',
                'image_urls'])});
            console.log('incomingrequests', incomingRequests);
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
