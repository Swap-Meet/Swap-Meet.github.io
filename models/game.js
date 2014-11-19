var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  owner: String,
  zip: String,
  title: String,
  platform: String,
  //images: [String]
  //score: String,
  //publisher: String,
  //short_description: String,
  //thumb: String,
});

module.exports = mongoose.model('Game', gameSchema);
