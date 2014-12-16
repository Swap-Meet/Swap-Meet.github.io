'use strict';
var returnGamesFromDB = require('../lib/returnGamesFromDB');

module.exports = function(app, auth) {

  //search all available games that are not in current user's inventory
  app.get('/api/search', auth, function(req, res) {
    var searchTerms;
    var searchJSON = {};

    //read in params into object
    if (req.query.hasOwnProperty('q')) {
      searchTerms = req.query.q.split('%20');
      for (var i = 0; i < searchTerms.length; i++) {
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

    searchJSON.owner = { $ne: req.user._id };

    return returnGamesFromDB(searchJSON, req.user._id, res);

  });
};
