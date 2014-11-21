var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
  you: 'String',
  yourgame: ['String'],
  //user1game: [{type: Schema.Types.ObjectId, ref: 'Game'}],
  me: 'String',
  mygame: ['String'],
  //user2game: [{type: Schema.Types.ObjectId, ref: 'Game'}],
  status: 'String'
});

module.exports = mongoose.model('Match', matchSchema);
