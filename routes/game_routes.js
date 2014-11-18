'use strict';
var Game = require('../models/game');
var queryString = require('query-string');
var plat, searchTerms, zipCode, expression, search, searchJSON;
module.exports = function(app) {
  //return first 10 games in db (change this to random later)
  app.get('/api/games', function(req, res) {
    searchJSON = {};
    //read in params into object
    console.log("req.query", req.query);

    if (req.query.hasOwnProperty('q')) {
      searchTerms = req.query.q.split('%');
      for (var i = 0; i < searchTerms.length; i++) {
        searchTerms[i] = "(?=.*" + searchTerms[i] + ")";
      //searchTerms[i] = new RegExp("(?=.*" + searchTerms[i] + ")");
      }
      searchTerms = searchTerms.join('');//new RegExp("" + s + "", "i");
      searchJSON.title = new RegExp('' + searchTerms + '', "i");

    }
    if (req.query.hasOwnProperty('p')) {
      searchJSON.platform = req.query.p;
    }
    if (req.query.hasOwnProperty('z')) {
      searchJSON.zip = Number(req.query.z);
    }

    console.log(typeof searchJSON);
    console.log(searchJSON)
    //if multiple search terms exist, deal with them here
    //if (searchTerms.length > 1) {
    //  var s = '';
    //for (var i = 0; i < searchTerms.length; i++) {
    //  searchTerms[i] = "(?=.*" + searchTerms[i] + ")";
      //searchTerms[i] = new RegExp("(?=.*" + searchTerms[i] + ")");
    //}
    //}
    //plat = req.query.p || '';
    //zipCode = req.query.z || '';
    //console.log(searchTerms, plat, zipCode);
    //var s = '';
    //for (var i = 0; i < searchTerms.length; i++) {
    //  searchTerms[i] = "(?=.*" + searchTerms[i] + ")";
      //searchTerms[i] = new RegExp("(?=.*" + searchTerms[i] + ")");
    //}

    //search = '' +
    //^(?=.*advancebrain)(?=.*com_ixxochart)(?=.*p=completed)
   // expression = searchTerms.join('');//new RegExp("" + s + "", "i");
   // expression = new RegExp('' + expression + '', "i");
   //     console.log(expression);
    //expression = new RegExp(".*" + search + ".*", "i");

    Game.find(searchJSON, function(err, data) {
      if (err) return res.status(500).json({error:1});
      console.log("body", data.body);
      //if (!data[0]) return res.status(200).json({error: 5});

      res.status(200).json({count: data.length, items_left: -1, games:data});
    });
  });
};