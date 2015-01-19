'use strict';
var Trade = require('../../models/trade.js');
var Game = require('../../models/game.js');
var _ = require('lodash');

module.exports = function() {

  //User.collection.remove(function(err) {if (err) throw err;});
  Game.collection.remove(function(err) {if (err) throw err;});
  //Trade.collection.remove(function(err) {if (err) throw err;});

  var games = [];
  //var users = [];
  var game;

  games[0] = {title:'Monkey Island', platform:'XBOX'};
  games[1] = {title:'God of War', platform:'PC'};
  games[2] = {title:'Bunny Wars', platform:'XBOX'};
  games[3] = {title:'Pokemon Snap', platform:'PS2'};
  games[4] = {title:'Monkey Island 4', platform:'XBOX'};
  games[5] = {title:'Sam and Max', platform:'PC'};

  _.forEach(games, function(item) {
    game = new Game(games[item]);
    game.save(function(err) { return err; });
  });

  return games;

};
