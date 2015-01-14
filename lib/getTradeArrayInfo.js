'use strict';
var _ = require('lodash');
var Trade = require('../models/trade.js');
var Game = require('../models/game.js');
var async = require('async');
var helpers = require('./helpers');

//takes in an array of tradeIds
//returns an object containing all information about the trade and games
module.exports = function(res, tradeIdArray) {

  var tradeInfoArray = [];

  //made tradeIdARray to game details array

  async.each(tradeIdArray, function(tradeId, callback) {

    //get detail of each trade
    Trade.findById(tradeId, function(err, trade) {

      ////FIX THIS - - - - need to address what happens if trade is null
      //if (!trade || err) callback('no trade or error');

      var returnTrade = _.pick(trade, ['outgoing_user', '_id',
        'outgoing_user_screenname', 'incoming_user', 'incoming_user_screenname',
        'outgoing_user_email', 'incoming_user_email']);

      returnTrade.potentialTrades = [];

      //find the game the trade centers around
      Game.findById(trade.gameId, function(err, game) {
        //add game info to returnTrade
        returnTrade.gameInfo = _.pick(game, ['_id', 'owner', 'owner_screenname',
          'zip', 'short_description', 'date_added', 'condition', 'title',
          'platform', 'image_urls']);

        //cycles through all the gameIds, looking up each one
        async.each(trade.potentialTrades, function(singleGame, done) {
          Game.findById(singleGame, function(err, ginfo) {

            returnTrade.potentialTrades.push(_.pick(ginfo,
              ['_id', 'owner', 'owner_screenname', 'zip', 'short_description',
              'date_added', 'condition', 'title', 'platform', 'image_urls']));
            //returnTrade.outgoing_user_email = ginfo.outgoing_user_email;

            done();
          });
        },
          function() {
            tradeInfoArray.push(returnTrade);
            callback();
          });
      });
    });
  },
  //callback returns expanded info about the trade
  function() {
    return helpers.returnSuccess(res, tradeInfoArray);
  });
};
