'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tradeSchema = new Schema({

  outgoing_user: String,
  outgoing_user_screenname: String,
  outgoing_user_email: String,
  incoming_user: String,
  incoming_user_screenname: String,
  incoming_user_email: String,
  gameId: String,
  potentialTrades: [String]

});

module.exports = mongoose.model('Trade', tradeSchema);
