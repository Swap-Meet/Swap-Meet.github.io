'use strict';

var Game = require('../models/game');
var _ = require('lodash');
var helpers = require('./helpers');

//takes an array of game IDs, returns an array of info on all the games
module.exports = function(gameIdArray, res) {
  var counter = 0;
  var numGames = gameIdArray.length;
  var passback = [];

  //there are no games in the array
  if (numGames === 0) return helpers.returnSuccess(res, []);

  _.forEach(gameIdArray, function(item) {
    Game.findById(item, function(err, game) {
      if (err) return res.status(400).json({error: 99});

      passback.push(_.pick(game, ['_id', 'title', 'zip', 'owner', 'owner_screenname',
        'date_added', 'short_description', 'platform', 'image_urls']));

      counter++;
      if (counter === numGames) {
        return res.status(200).json({error: 0, items: passback});
      }
    });
  });
};
