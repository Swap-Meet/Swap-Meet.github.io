'use strict';
var Game = require('../models/game');
var helpers = require('../lib/helpers');

module.exports = function(app) {

  //returns the latest 20 additions to the db
  //no authentication required
  app.get('/api/browse', function(req, res) {
    Game.find({}, function(err, data) {
      if (err) helpers.returnError(res, 99, 'cannot get games', 404);
      return helpers.returnSuccess(res, data.slice(data.length - 20, data.length));
    });
  });
};
