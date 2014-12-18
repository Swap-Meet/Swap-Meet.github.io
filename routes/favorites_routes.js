'use strict';
var User = require('../models/user');
var getGameInfo = require('../lib/getGameInfo');
var helpers  = require('../lib/helpers');

module.exports = function(app, auth) {

 //add a game to favorites
  app.post('/api/games/favorites', auth, function(req, res) {

    //find user making the request
    User.findById(req.user._id, function(err, user) {
      if (err) return helpers.returnError(res, 5, 'error finding user');

      //add game from request to the user's favorites
      user.favorites.push(req.body._id);

      //save the user
      user.save(function(err) {
        if (err) helpers.returnError(res, 1, 'error saving favorites');
        return helpers.returnSuccess(res, 200);
      });
    });
  });

  //delete a game from favorites
  app.delete('/api/games/favorites', auth, function(req, res) {
    var gameIndex;

    //find user making the request
    User.findById(req.user._id, function(err, user) {
      gameIndex = user.favorites.indexOf(req.body.id);

      //game exists and can be deleted
      if (gameIndex !== -1) {
        user.favorites = user.favorites.slice(gameIndex, gameIndex + 1);
        user.save(function(err) {
          if (err) return helpers.returnError(err, res, 1, 'error saving favs');
          return helpers.returnSuccess(res);
        });
      }
      //game doesn't exist in favorites
      else return helpers.returnError(res, 7, 'game not in favs', 400);
    });
  });

  //return an array of favorites
  app.get('/api/games/favorites', auth, function(req, res) {
    //console.log('here is user infor', req.user.favorites);
    return getGameInfo(req.user.favorites, res);
  });
};
