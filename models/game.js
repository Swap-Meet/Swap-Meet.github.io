'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({

  title: String,
  score: String,
  publisher: String,
  zip: String,
  latitude: String,
  longitude: String,
  owner: String, //id number
  owner_screenname: String,
  date_added: Object,
  short_description: String,
  platform: String,
  image_urls: ['String']
});

module.exports = mongoose.model('Game', gameSchema);
