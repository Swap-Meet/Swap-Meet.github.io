'use strict';
var Game = require('../models/game');
var queryString = require('query-string');
var URL;
module.exports = function(app) {

  //return first 10 games in db (change this to random later)
  app.get('/api/games/:ext', function(req, res) {
    URL = req.params.ext;
    console.log(URL);
    Game.find({}, function(err, data) {
      if (err) return res.status(500).json({error:'there was an error'});
      res.json(data);
    });
  });
};