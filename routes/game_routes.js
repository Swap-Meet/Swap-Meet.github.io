'use strict';
var eachAsync = require('each-async');
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
      passback = data.slice(start, Math.min(data.length + 1,start + 10))
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
        if (user.wantsGames[i].gameId == gameId) {
          alreadyWanted = true;
        }
      }

      //if not already wanted, add to wantsgames
      console.log(alreadyWanted);
      console.log("owner", owner);
      console.log("gameId", gameId);
      if (!alreadyWanted) {
        console.log("wants", user.wantsGames);
        user.wantsGames.push({gameId: gameId, ownerId: owner});
        console.log(user.wantsGames);
        user.save(function(err) {
          if (err) return res.json({"error":1, 'msg': 'error saving to user wantsGames'});
          console.log('success');
          res.status(200).json({error:0}); //updated user
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

  //returns all the user's wanted games
  app.get('/api/games/mywants', auth, function(req, res) {
    var i, _id = req.user._id;
    var myWants = [];

    //finds the user's info
    User.findById(_id, function(err, data){
      if (err) return res.status(500).json({error:7});

      //cycles through the user's wantsGames
      for (i = 0; i < data.wantsGames.length; i++) {
        //console.log("puppy", Game.find({'_id': data.wantsGames[i]}));
        Game.find({'_id': data.wantsGames[i]}, function(errGame, dataGame){

          if (dataGame) myWants.push(dataGame);
          console.log("test:", myWants);

        })
      }
      res.status(200).json({"error":0,
      "items": {"wantsgames": myWants}});
    });

  });

  //returns all the users's games
  app.get('/api/games/mygames', auth, function(req, res) {
    var i, _id = req.user._id;
    var myGames = [];

    User.findById(_id, function(err, data){
      if (err) return res.status(500).json({error:7});

      eachAsync(data.hasGames, function(item, index, done) {
        Game.find({'_id': item}, function(errGame, dataGame){
            myGames.push(dataGame);
            console.log("test:", myGames);
          })
          done();
        },
        function(err){
          if (err) return (err);
          console.log("hi");
        }
      )
    });
  });

  // //get the hasgames and wantsgames of user
  // app.get('/api/games/mygames', auth, function(req, res) {
  //   var i, _id = req.user._id;
  //   var myGames = [], myWants = [];


  //   //find the user who is making the request
  //   User.findById(_id, function(err, data){
  //     console.log("data.hasgames", data.hasGames);
  //     if (err) return res.status(500).json({error:7});
  //     //console.log("userinfo", data);

  //     for (i = 0; i < data.hasGames.length; i++) {
  //       //console.log(data.hasGames[i]);
  //       console.log("puppy", Game.find({'_id': data.hasGames[i]}));
  //       Game.find({'_id': data.hasGames[i]}, function(errGame, dataGame){
  //         //if (errGame || !dataGame) hasGames = [];
  //         myGames[i] = dataGame;
  //         console.log("test:", myGames);
  //         //console.log("dataGame", dataGame);
  //       })
  //     }

  //     for (i = 0; i < data.wantsGames.length; i++) {
  //       Game.find({'_id': data.wantsGames[i]._id}, function(errGame, dataGame){
  //         //console.log("dataGame", dataGame);
  //         //if (errGame || !dataGame) hasGames = [];
  //         myWants[i] = dataGame;
  //         //console.log("dataGame", dataGame);
  //       })
  //     }
  //     //find game info for hasgames
  //     /*Game.findById(data.hasGames, function(errGame, dataGame){
  //       console.log("dataGame", dataGame);
  //       //if (errGame || !dataGame) hasGames = [];
  //       myGames = dataGame;
  //     });

  //     Game.findById(data.wantsGames, function(errGame, dataGame){
  //       //if (errGame || !dataGame) wantsGames = [];
  //       myWants = dataGame;
  //       console.log("wantsgames", dataGame, errGame);
  //     });*/
  //   });

  //   console.log("has", myGames);
  //   console.log("wants", myWants)
  //   res.status(200).json({"error":0,
  //     "items": {"wantsgames": myWants, "hasgames": myGames}})
  // });

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
        user.hasGames.push(game._id);
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
