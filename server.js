'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var app = express();

// Serve the WebApp Homepage starter
var staticDir = __dirname + '/build';
app.use(express.static(staticDir));

//connect to mongoose
mongoose.connect(process.env.MONGOLAB_URI ||
	process.env.MONGO_URL || 'mongodb://localhost/game_swap_test');

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

//*** Karl's Possibilities
//For the potential of using jade
// app.set('views', config.rootPath + '/server/views');
// app.set('view engine', 'jade');
// app.get('/templates/:partialPath', function(req, res) {
//   res.render('/templates/' + req.params.partialPath);
// });
// app.get('*', function(req, res) {
//   res.render('index');
// });

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Server listening on port 3000');
});
