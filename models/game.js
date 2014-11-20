var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({

  title: 'String',
  score: 'String',
  publisher: 'String',
  zip: 'String',
  owner: 'String', //id number
  short_description: 'String',
  platform: 'String',
  image_url: ['String']
});

module.exports = mongoose.model('Game', gameSchema);
