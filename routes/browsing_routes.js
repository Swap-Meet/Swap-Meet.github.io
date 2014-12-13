'use strict';
var Game = require('../models/game');

module.exports = function(app) {
<<<<<<< HEAD
  app.get('/api/allgames', function(req, res) {
    var games = Game.find({}).limit(10).exec(function(err, games) {
      if (err) return res.status(400).json({"error":1});
      res.status(200).json({"error":0, "items": games});
    });
  });

  /*app.get('/api/allgames', function(req, res) {
=======
  app.get('/api/browse', function(req, res) {
>>>>>>> 1231a34e218fb7c3a78b70e308bc93ad4359e3de
    Game.find({}, function(err, data) {
      res.status(200).json({error: 0, items: data.slice(data.length - 20, data.length)});
    });
<<<<<<< HEAD

    res.status(200).send({"error":0,
        "items": {"wantsgames": wantsGames, "hasgames": hasGames}})
  });*/

=======
  });
>>>>>>> 1231a34e218fb7c3a78b70e308bc93ad4359e3de
};
