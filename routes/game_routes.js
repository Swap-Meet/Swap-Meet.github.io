'use strict';
var Game = require('../models/game');
var queryString = require('query-string');
var plat, searchTerms, zipCode, expression, search, searchJSON;

module.exports = function(app, auth) {
  //return first 10 games in db (change this to random later)
  app.get('/api/wantsgames', function(req, res) {
    var plat, searchTerms, zipCode, expression, search, searchJSON = {};
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

    Game.find(searchJSON, function(err, data) {
      if (err) return res.status(500).json({error:1});
      console.log("body", data.body);
      //if (!data[0]) return res.status(200).json({error: 5});

      res.status(200).json({count: data.length, items_left: -1, games:data});
    });
  });

  app.post('/api/games/wantsgames', function(){
    //adding to wants
  });

  app.delete('/api/games/wantsgames', function(){
    //delete a game user no longer wants
  });

  app.get('/api/user/mygames', function(){
    //see my has and wants
  });

  app.post('/api/user/hasgames', function(){
    //create a has
  });

  app.delete('/api/user/hasgames', function(){
    //delete a game from user's inventory
  });
};