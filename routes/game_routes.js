'use strict';
var Game = require('../models/game');

module.exports = function(app) {

  //return first 10 games in db (change this to random later)
  app.get('/api/games', function(req, res) {
    Game.find({}, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });
};