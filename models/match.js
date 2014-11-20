var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
  user1: 'String',
  user1game: ['String'],
  //user1game: [{type: Schema.Types.ObjectId, ref: 'Game'}],
  user2: 'String',
  user2game: ['String'],
  //user2game: [{type: Schema.Types.ObjectId, ref: 'Game'}],
  status: 'String'
});

module.exports = mongoose.model('Match', matchSchema);
