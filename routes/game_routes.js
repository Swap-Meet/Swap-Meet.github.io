'use strict';
var Game = require('../models/game');
var User = require('../models/user');
var plat, searchTerms, zipCode, expression, search, searchJSON;

module.exports = function(app, auth) {
  //return first 10 games in db (change this to random later)
  app.get('/api/wantsgames', auth, function(req, res) {
    var total, plat, searchTerms, passback, zipCode, expression, search, start = 0, totalLeft, searchJSON = {};
    console.log(req);
    //read in params into object
    console.log("req.query", req.query);

    if (req.query.hasOwnProperty('q')) {
      console.log(req.query.q);
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
    if (req.query.hasOwnProperty('s')) {
      start = Number(req.query.s);
    }

    console.log(typeof searchJSON);
    console.log(searchJSON)

    Game.find(searchJSON, function(err, data) {
      if (err) return res.status(500).json({error:1});
      console.log("body", data.body);
      total = data.length;
      passback = data.slice(start, Math.min(data.length+1,start+10))
      if (!passback) return res.status(200).json({"error": 0, "count": 0,
        "items_left": 0,
        "items":[]});
      res.status(200).json({"error": 0, "count": Math.min(10, passback.length),
        "items_left": Math.max(0,total - start - 10),
        "items":passback});
    });

  });

  app.post('/api/games/wantsgames', function() {
    //adding to wants
  });

  app.delete('/api/games/wantsgames', function() {
    //delete a game user no longer wants
  });

  app.get('/api/games/mygames', auth, function(req, res) {
    var _id = req.user._id;
    var hasGames, wantsGames;
    User.find({"_id" : _id}, function(err, data){
      if (err) return res.status(500).json({error:7});
      Game.find({"_id": {$in: data.hasgames}}, function(errGame, dataGame){
        if (errGame) hasGames = [];
        return hasGames = dataGame;
      });
      Game.find({"_id": {$in: data.wantsgames}}, function(errGame, dataGame){
        if (errGame) wantsGames = [];
        return wantsGames = dataGame;
      });
      res.status(200).send({"error":0,
        "items": {"wantsgames": wantsGames, "hasgames": hasGames}})});
  });


  app.post('/api/user/hasgames', function() {
    //create a has
  });

  app.delete('/api/games/hasgames', function() {
    //delete a game from user's inventory
  });
};