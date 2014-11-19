'use strict';
var User = require('../models/user');
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

  app.delete('/api/games/wantsgames', function(){
    //delete a game user no longer wants
  });

  app.get('/api/games/mygames', function(){
    //see my has and wants
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
