'use strict';

var User = require('../models/user');
var Game = require('../models/game');
var returnIfError = require('../lib/returnIfError');
var getGameInfo = require('../lib/getGameInfo');
var returnSuccess = require('../lib/returnSuccess');
var _ = require('lodash');

module.exports = function(app, auth) {
/*
  //Remove game from user's list
  app.delete('/api/games/inventory', auth, function(req, res) {
    var gameId = req.body.id;
    Game.remove({ _id: gameId }, function(err) {
      if (err) return res.json({error:10, msg:'invalid id'});
      //console.log('removed game document');
    });

    //find the user based on the incoming jwt token
    User.findById(req.user._id, function(err, user) {
      returnIfError(err, res, 6, 'error finding user');
      if (user === null) return res.json({error:6, msg: 'user is null'});

      //check to see if game is in this user's hasGames
      var stillHas = true;
      for (var i = 0; i < user.hasGames.length; i++) {
        if (user.hasGames[i] === gameId) {
          user.hasGames.splice(i, 1);
          stillHas = false;
          break;
        }
      }

      //delete game from other user's wants games
      User.find(
        {wantsGames: {$elemMatch: {gameId: gameId}}}, function(err, data) {
          if (!data) return res.json({error: 1});
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].wantsGames.length; j++) {
              if (data[i].wantsGames[j].gameId === gameId) {
                data[i].wantsGames.splice(j, 1);
                break;
              }
            }
            data[i].save(returnIfError(err, res, 1, 'error saving'));
          }
          if (!stillHas) {
            user.save(function(err) {
              returnIfError(err, res, 1, 'error saving');
              res.status(200).json({error: 0}); //updated user
            });
          } else {
            res.json({error: 9, message: 'game not found in user list'});
          }
        });
    });
  });
*/
  //view the users's inventory
  app.get('/api/games/inventory', auth, function(req, res) {
    return getGameInfo(req.user.inventory, res);
  });

  //add a game to user's inventory
  app.post('/api/games/inventory', auth, function(req, res) {
    var newGame = new Game();
    newGame.owner = req.user._id;
    if (req.body.title === '' || req.body.platform === '') {
      res.status(400).json({error:11});
    }
    //create new game
    //newGame = _.pick(req.body, ['title', 'platform']);
    newGame.title = req.body.title;
    newGame.platform =  req.body.platform;
    newGame.condition = req.body.condition || '';
    newGame.image_urls = req.body.image_urls || [];
    newGame.short_description = req.body.short_description || '';

    //save the new game
    newGame.save(function(err, game) {

      returnIfError(err, res, 37, 'cannot save new game', 400);//if (err) returnIfErr res.send(err);
      //find the current user & push new game's reference ID to hasGames list
      User.findById(req.user._id, function(err, user) {

        returnIfError(err, res, 1, 'error finding user');
        if (user === null) return console.log({error: 1, msg:'user is null'});

        user.inventory.push(game._id);
        user.save(function(err) {
          returnIfError(err, res, 1, 'error saving game');
        });
      });

      returnSuccess(res, newGame);//return res.status(200).json({error: 0, item: newGame});
    });
  });
};
