'use strict';
var Game = require('../models/game');

module.exports = function(app) {
  app.get('/api/browse', function(req, res) {
    Game.find({}, function(err, data) {
      res.status(200).json({error: 0,
        items: data.slice(data.length - 20, data.length)});
    });
  });
};
