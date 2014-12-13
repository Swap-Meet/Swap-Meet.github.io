'use strict';
var User = require('../models/user');
//var Game = require('../models/game');
//var findGameInDB = require('../lib/findGameInDB');
var getGameInfo = require('../lib/getGameInfo');

var returnIfError = require('../lib/returnIfError');

module.exports = function(app, auth) {

 //add a game to favorites
  app.post('/api/games/favorites', auth, function(req, res) {
    var gameId = req.body._id;
    //console.log(req.user._id);
    User.findById(req.user._id, function(err, user) {
      returnIfError(err, res, 5, 'error finding user');
      user.favorites.push(gameId);
      user.save(function(err) {
        if (err) returnIfError(err, res, 1, 'error saving favorites');
        res.status(200).json({error: 0, items: getGameInfo(user.favorites)});
      });
    });
  });

  //delete a game from favorites
  app.delete('/api/games/favorites', auth, function(req, res) {
    var gameId = req.body.id;
    var gameIndex;

    User.findById(req.user._id, function(err, user) {
      gameIndex = user.favorites.indexOf(gameId);
      if (gameIndex !== -1) {
        user.favorites.splice(gameIndex, 1);
      }
      else {
        res.status(200).json({error:7, msg: 'invalid gameID'});
      }
      user.save(function(err) {
        if (err) returnIfError(err, res, 1, 'error saving favorites');
        res.status(200).json({error: 0, items: getGameInfo(user.favorites)});
      });
    });
  });

  //return an array of favorites
  app.get('/api/games/favorites', auth, function(req, res) {
    var returnThis = getGameInfo(req.user.favorites);
    //console.log('this', returnThis);
    return res.status(200).json({error: 0, items: returnThis});
  });
};
