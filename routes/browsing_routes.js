'use strict';
var Game = require('../models/game');

module.exports = function(app) {

  app.get('/api/allgames', function(req, res) {
    Game.find({}, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

};
