'use strict';
var User = require('../models/user');
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
      searchTerms = req.query.q.split('%20');
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
      searchJSON.zip = req.query.z;
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

  app.post('/api/games/wantsgames', auth, function(req, res){

    var gameId = req.body.id;

    User.findById(req.user._id, function(err, user) {
      if (err) return console.log('error finding user');
      if (user === null) return console.log('user is null');

      var alreadyWanted;
      alreadyWanted = user.wantsGames.every(function(element, index, array) {
        if (element == gameId) {
          console.log('true');
          res.json({"error": 8, "message": "game already in favorites"});
          return true;
        } else {
          console.log('false');
          return false;
        }
      });

      if (!alreadyWanted) {
        user.wantsGames.push(gameId);
        user.save(function(err) {
          if (err) return console.log('error saving to user hasGames');
          console.log('success');
          res.json(user); //updated user
        });
      }
    });
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

  app.post('/api/games/hasgames', auth, function(req, res){
    var newGame = new Game();
    newGame.owner = req.user._id;
    newGame.title = req.body.title;
    newGame.platform =  req.body.platform;

    newGame.save(function(err, game) {
      if (err) return res.send(err);
      User.findById(req.user._id, function(err, user) {
        if (err) return console.log('error finding user');
        if (user === null) return console.log('user is null');
        user.hasGames.push(game._id);
        user.save(function(err) {
          if (err) return console.log('error saving to user hasGames');
          console.log('success');
        });
      });
      res.json(game);
    });
  });

  app.delete('/api/games/hasgames', function(){
    //delete a game from user's inventory
  });
};
