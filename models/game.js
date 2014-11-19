var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({

  title: 'String',
  score: 'String',
  publisher: 'String',
  zip: 'String',
  owner: 'String',
  short_description: 'String',
  platform: 'String',
  thumb: 'String'
});

var Games = mongoose.model('Game', gameSchema);


//thanks to the Mongoose validation docs:
// http://mongoosejs.com/docs/2.7.x/docs/validation.html


module.exports = mongoose.model('Game', gameSchema);
