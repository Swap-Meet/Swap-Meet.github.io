'use strict';
var Game = require('../models/game');

module.exports = function(app) {
  app.get('/api/allgames', function(req, res) {
    var games = Game.find({}).limit(10).exec(function(err, games) {
      if (err) return res.status(400).json({"error":1});
      res.status(200).json({"error":0, "items": games});
    });
  });

  /*app.get('/api/allgames', function(req, res) {
    Game.find({}, function(err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });

    res.status(200).send({"error":0,
        "items": {"wantsgames": wantsGames, "hasgames": hasGames}})
  });*/

};
