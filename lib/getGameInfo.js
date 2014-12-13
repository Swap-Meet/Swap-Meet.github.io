'use strict';

var Game = require('../models/game');
var _ = require('lodash');

//takes an array of game IDs, returns an array of info on all the games
module.exports = function(gameIdArray) {
  var counter = 0;
  var numGames = gameIdArray.length;
  var passBack = [];
  //console.log('id array', gameIdArray);
  _.map(gameIdArray, function(currentValue) {
    Game.find({_id: currentValue}, function(err, game) {
      if (err) console.log('BAD');
      passBack.push({
        id: game._id,
        owner: game.owner,
        title: game.title,
        zip: game.zip,
        platform: game.platform,
        img_urls: game.img_urls
      });
      counter++;

      if (counter === numGames) {
        return passBack;
      }
    });
  });
};
