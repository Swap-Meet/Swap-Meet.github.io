'use strict';
var User = require('../models/user');
var Game = require('../models/game');
var User = require('../models/user');
var plat, searchTerms, zipCode, expression, search, searchJSON;

module.exports = function(app, auth) {

  //search all available games
  app.get('/api/wantsgames', auth, function(req, res) {
    var total, plat, searchTerms, passback, zipCode, expression, search, start = 0, totalLeft, searchJSON = {};
    //console.log(req);
    //read in params into object
    console.log("req.query", req.query);

    if (req.query.hasOwnProperty('q')) {
      //console.log(req.query.q);
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


  //add a game to user's wantgames list
  app.post('/api/games/wantsgames', auth, function(req, res){

    var gameId = req.body.id;
    var owner;// = req.body.owner;
    //console.log(req.body);
    //checks to see if game ID is valid
    Game.findById(gameId, function(err, game) {
      if (err) return res.json({"error":10, "msg":"invalid id"});
      if(game) owner = game.owner;
    });

    //find the user based on the incoming jwt token
    User.findById(req.user._id, function(err, user) {
      if (err) return res.json({"error":6, 'msg': 'error finding user'});
      if (user === null) return res.json({"error":6, 'msg': 'user is null'});

      //check to see if game is already in this user's wantsgames
      var alreadyWanted = false;
      for (var i = 0; i < user.wantsGames.length; i++) {
        if (user.wantsGames[i].id == gameId) {
          alreadyWanted = true;
        }
      }

      //if not already wanted, add to wantsgames
      console.log(alreadyWanted);
      console.log("owner", owner);
      console.log("gameId", gameId);
      if (!alreadyWanted) {
        console.log("wants", user.wantsGames);
        user.wantsGames.push({gameId: gameId, ownerId: ownerId});
        console.log(user.wantsGames);
        user.save(function(err) {
          if (err) return res.json({"error":1, 'msg': 'error saving to user wantsGames'});
          console.log('success');
          return res.status(200).json({error:0}); //updated user
        });
      }
      else {
        console.log("i");
        res.json({"error": 8, "msg": "game already in favorites"});
      }
    });

  });

  app.delete('/api/games/wantsgames', function() {
    //delete a game user no longer wants
  });

  //get the hasgames and wantsgames of user
  /*app.get('/api/games/mygames', auth, function(req, res) {
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
  });*/

  //add a game to user's hasgames inventory
  app.post('/api/games/hasgames', auth, function(req, res){
    var newGame = new Game();
    newGame.owner = req.user._id;
    console.log(req.body);
    newGame.title = req.body.title;
    newGame.platform =  req.body.platform;

    newGame.save(function(err, game) {
      if (err) return res.send(err);
      User.findById(req.user._id, function(err, user) {
        if (err) return console.log({error: 1, 'msg':'error finding user'});
        if (user === null) return console.log({error: 1, 'msg':'user is null'});
        user.hasGames.push({"id": game._id});
        user.save(function(err) {
          if (err) return console.log({error:1, 'msg':'error saving to user hasGames'});
          console.log('success');
        });
      });
      res.status(200).json({'error': 0});
    });
  });

  app.delete('/api/games/hasgames', function(){
    //delete a game from user's inventory
  });
};
