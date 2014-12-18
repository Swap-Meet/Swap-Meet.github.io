'use strict';
var _ = require('lodash');
var Trade = require('../models/trade.js');
var Game = require('../models/game.js');
var async = require('async');
var helpers = require('./helpers');
//var mongoose = require('mongoose');

//takes in an array of tradeIds
//returns an object containing all information about the trade and games
module.exports = function(res, tradeIdArray) {

  var tradeInfoArray = [];

  //made tradeIdARray to game details array
  async.each(tradeIdArray, function(tradeId, callback) {
    //console.log('tradeid', tradeId);
    //get detail of each trade
    Trade.findById(tradeId, function(err, trade) {
      //console.log('hiiiiiii', trade);
      var returnTrade = {};

      returnTrade.outgoing_user = trade.outgoing_user;
      returnTrade._id = trade._id;
      returnTrade.outgoing_user_screenname = trade.outgoing_user_screenname;
      returnTrade.incoming_user = trade.incoming_user;
      returnTrade.incoming_user_screenname = trade.incoming_user_screenname;
      returnTrade.potentialTrades = [];

      //find the game the trade centers around
      Game.findById(trade.gameId, function(err, game) {
        //add game info to returnTrade
        returnTrade.gameInfo = _.pick(game, ['_id', 'owner', 'owner_screenname',
          'zip', 'short_description', 'date_added', 'condition', 'title',
          'platform']);
        //console.log('return me', returnTrade, trade.potentialTrades);

        //cycles through all the gameIds, looking up each one
        async.each(trade.potentialTrades, function(singleGame, done) {
          Game.findById(singleGame, function(err, ginfo) {
            //console.log('executes');
            returnTrade.potentialTrades.push(_.pick(ginfo,
              ['_id', 'owner', 'owner_screenname', 'zip', 'short_description',
              'date_added', 'condition', 'title', 'platform']));
            //console.log('final array ', returnTrade);
            done();
          });
        },
          function() {
            //console.log('pushed in');
            tradeInfoArray.push(returnTrade);
            callback();
          });
        //callback();
      });
      //callback();
    });
  },

  function() {
    //console.log('these are details', tradeInfoArray);
    return helpers.returnSuccess(res, tradeInfoArray);
  });
};
