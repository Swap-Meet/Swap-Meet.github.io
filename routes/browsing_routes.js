'use strict';
//var returnGamesFromDB = require('../lib/returnGamesFromDB');
var _ = require('lodash');
var Game = require('../models/game.js');
var helpers = require('../lib/helpers');

module.exports = function(app) {

  //allows the user to search without authentication
  app.get('/api/browse', function(req, res) {
    var searchTerms;
    var searchJSON = {};
    var dataObj = {};
    var actualResult = [];
    var i;
    var total;
    var passback;
    var start = 0;

    //read in params into object
    if (req.query.hasOwnProperty('q')) {
      searchTerms = req.query.q.split('%20');
      for (i = 0; i < searchTerms.length; i++) {
        searchTerms[i] = '(?=.*' + searchTerms[i] + ')';
      }
      searchTerms = searchTerms.join('');
      searchJSON.title = new RegExp('' + searchTerms + '', 'i');

    }
    if (req.query.hasOwnProperty('p')) {
      searchJSON.platform = req.query.p;
    }
    if (req.query.hasOwnProperty('z')) {
      searchJSON.zip = req.query.z;
    }
    if (req.query.hasOwnProperty('s')) {
      searchJSON.start = Number(req.query.s);
    }
    if (req.query.hasOwnProperty('r')) {
      searchJSON.radius = req.query.z;
    }

    //find games that match query params
    Game.find(searchJSON, function(err, data) {
      if (err) return helpers.returnError(res, 1, 'caanot find games');

      //create JS object from Mongoose object to add boolean flag to results
      for (i = 0; i < data.length; i++) {

        dataObj = _.pick(data[i],
        ['_id', 'title', 'zip', 'owner', 'owner_screenname',
        'date_added', 'short_description', 'platform', 'owner', 'image_urls']);
        dataObj.already_wanted = false;
        actualResult.push(dataObj);
      }

      //Return results in chunks for front-end pagination
      total = data.length;
      passback = actualResult.slice(searchJSON.start,
      Math.min(actualResult.length + 1, start + 10));

      //no games exist
      if (!passback) return res.status(200).json({
        error: 0,
        count: 0,
        items_left: 0,
        items:[]
      });
      return res.status(200).json({
        error: 0,
        count: Math.min(10, passback.length),
        items_left: Math.max(0, total - start - 10),
        items:passback
      });

    });

  });

  //old unauth browsing route
  // //returns the latest 20 additions to the db
  // //no authentication required
  // app.get('/api/browse', function(req, res) {
  //   Game.find({}, function(err, data) {
  //     if (err) helpers.returnError(res, 99, 'cannot get games', 404);
  //     return helpers.returnSuccess(res, data.slice(data.length - 20, data.length));
  //   });
  // });
};
