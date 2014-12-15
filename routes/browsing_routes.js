'use strict';
var Game = require('../models/game');
var returnIfError = require('../lib/returnIfError');
var returnSuccess = require('../lib/returnSuccess');

module.exports = function(app) {

  //returns the latest 20 additions to the db
  //no authentication required
  app.get('/api/browse', function(req, res) {
    Game.find({}, function(err, data) {
      returnIfError(err, res, 99, 'cannot get games', 404);
      returnSuccess(res, data.slice(data.length - 20, data.length));
      // return res.status(200).json({
      //   error: 0,
      //   items: data.slice(data.length - 20, data.length)
      // });
    });
  });
};
