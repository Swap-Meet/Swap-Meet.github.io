'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var app = express();

//conncect to mongoose
mongoose.connect(process.env.MONGOLAB_URI ||
	process.env.MONGO_URL || 'mongodb://localhost/gameSwap');

//use bodyparser middleware for encoded (thanks to Jake for helping me )
//necessary to use postman!
app.use(bodyparser.urlencoded({extended:true}));

//use bodyparser middleware
app.use(bodyparser.json());

app.set('jwtSecret', process.env.JWT_SECRET || 'totallysecretsecret');

//passes in the secret to decode the jwt
var jwtauth = require('./lib/jwt_auth')(app.get('jwtSecret'));

require('./routes/users_routes')(app, jwtauth);
require('./routes/game_routes')(app, jwtauth);
require('./routes/inventory_routes')(app, jwtauth);
require('./routes/trade_routes')(app, jwtauth);
require('./routes/favorites_routes')(app, jwtauth);
require('./routes/browsing_routes')(app);

//listen on port 3000
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});
