'use strict';
var User = require('../models/user');
//var Game = require('../models/game');
//var findGameInDB = require('../lib/findGameInDB');
var getGameInfo = require('../lib/getGameInfo');
var returnSuccess = require('../lib/returnSuccess');
var returnIfError = require('../lib/returnIfError');

module.exports = function(app, auth) {

 //add a game to favorites
  app.post('/api/games/favorites', auth, function(req, res) {
    var gameId = req.body._id;
    //console.log(req.user._id);

    //find user making the request
    User.findById(req.user._id, function(err, user) {
      returnIfError(err, res, 5, 'error finding user');

      //add game to the user's favorites
      user.favorites.push(gameId);

      //save the user
      user.save(function(err) {
        returnIfError(err, res, 1, 'error saving favorites');
        returnSuccess(res, 200);//return res.status(200).json({error: 0});
      });
    });
  });

  //delete a game from favorites
  app.delete('/api/games/favorites', auth, function(req, res) {
    var gameId = req.body.id;
    var gameIndex;

    //find user making the request
    User.findById(req.user._id, function(err, user) {
      gameIndex = user.favorites.indexOf(gameId);

      //game exists and can be deleted
      if (gameIndex !== -1) {
        user.favorites = user.favorites.slice(gameIndex, gameIndex + 1);
        user.save(function(err) {
          returnIfError(err, res, 1, 'error saving favorites');
          returnSuccess(res);
          // return res.status(200).json({
          //   error: 0
          // });
        });
      }
      //game doesn't exist in favorites
      else {
        return res.status(400).json({
          error: 7,
          msg: 'game not in favorites'
        });
      }
    });
  });

  //return an array of favorites
  app.get('/api/games/favorites', auth, function(req, res) {
    return getGameInfo(req.user.favorites, res);
  });
};
