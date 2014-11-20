'use strict';
var Game = require('../models/game');

module.exports = function(app) {

  app.get('/api/browse', function(req, res) {

  	Game.where('_id').gte(0).limit(20).sort({'_id':-1}).exec(function(err, data){console.log(data);});
    Game.find({}, function(err, data){
    	console.log(data);
    	res.json(data);
    });
  });

};
