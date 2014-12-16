'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  screenname: String,
  zip: String,
  latitude: String,
  longitude: String,
  avatar_url: String,
  inventory: [String],
  favorites: [String],
  last_login: Object,
  outgoingRequests: [Schema.Types.Mixed],
  incomingRequests: [Schema.Types.Mixed]
});

userSchema.methods.generateHash = function(password) {
  //uses syncronous function (unusual in node)
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

//the ID from the mongo database is what's passed back and forth
userSchema.methods.generateToken = function(secret) {
  var _this = this;
  var expiration = Date.now() + 600000;
  var token = jwt.encode({
    iss: _this._id, //aka ID
    exp: expiration.toString()
  }, secret);
  return token;
};

module.exports = mongoose.model('User', userSchema);
