'use strict';
var _ = require('lodash');
//var User = require('../models/user');
//var Game = require('../models/game');

module.exports = {
  // deleteGameFromDB: function(gameId, callback) {

  // },

  // deleteGameFromUserInventory: function(res, gameId, user, callback) {
  //   if (!gameId || !user) return this.returnError(res, 8, 'cannot find');
  //   User.findById(gameId, function(err, user) {

  //     user.save(function(err) {

  //     });
  //   });
  // },

  // deleteGameFromTrades: function(gameId, callback) {

  // },

  // deleteGameFromAllFavorites: function(gameId, callback) {

  // },

  filterOutGame: function(array, gameId) {
    //console.log('inputs', array, gameId);
    return _.filter(array, function(item) {
      return (item == gameId) ? false : true;
    });
  },

  returnSuccess: function(res, items) {
    res.status(200).json({
    error: 0,
    items: items || []
    });
  },

  returnError: function(res, errorCode, msg, status) {
    return res.status(status || 400).json({
      error:errorCode,
      msg: msg
    });
  }
};
