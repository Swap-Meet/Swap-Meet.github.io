'use strict';
var _ = require('lodash');

module.exports = {
  deleteGameFromDB: function(gameId, callback) {

  },

  deleteGameFromUserInventory: function(gameId, userId, callback) {

  },

  deleteGameFromTrades: function(gameId, callback) {

  },

  deleteGameFromAllFavorites: function(gameId, callback) {

  },

  filterOutGame: function(array, gameId) {
    return _.filter(array, function(item){
      (item.gameId == gameId) ? false : true;
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
