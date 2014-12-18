'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tradeSchema = new Schema({

  outgoing_user: String,
  outgoing_user_screenname: String,
  incoming_user: String,
  incoming_user_screenname: String,
  gameId: String,
  potentialTrades: [String]
  // title: String,
  // score: String,
  // publisher: String,
  // zip: String,
  // latitude: String,
  // longitude: String,
  // owner: String, //id number
  // owner_screenname: String,
  // date_added: Object,
  // short_description: String,
  // platform: String,
  // image_urls: ['String']
});

module.exports = mongoose.model('Trade', gameSchema);
