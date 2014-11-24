'use strict';
var eachAsync = require('each-async');
var User = require('../models/user');
var Game = require('../models/game');
var plat;
var searchTerms;
var zipCode;
var expression;
var search;
var searchJSON;

module.exports = function(app, auth) {

  //search all available games that are not in current user's inventory
  app.get('/api/wantsgames', auth, function(req, res) {
    var wants;
    var total;
    var plat;
    var searchTerms;
    var passback;
    var zipCode;
    var expression;
    var search;
    var totalLeft;
    var i;
    var start = 0;
    var searchJSON = {};
    var dataObj;

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
      start = Number(req.query.s);
    }

    searchJSON.owner = { $ne: req.user._id };

    //find games that match query params
    Game.find(searchJSON, function(err, data) {
      if (err) return res.status(500).json({error:1});

      //Flag current user's already wanted games so that front-end can display
      User.findById(req.user._id, function(err, user) {
        if (err) return res.json({error: 6, msg: 'error finding user'});
        if (user === null) return res.json({error: 6, msg: 'user is null'});
        var actualResult = [];

        //create JS object from Mongoose object to add boolean flag to results
        for (var i = 0; i < data.length; i++) {
          dataObj = {};
          dataObj._id = data[i]._id;
          dataObj.title = data[i].title;
          dataObj.platform = data[i].platform;
          dataObj.image_urls = data[i].image_urls;
          dataObj.already_wanted = false;
          for (var j = 0; j < user.wantsGames.length; j++) {
            if (data[i]._id == user.wantsGames[j].gameId) {
              dataObj.already_wanted = true;
              break;
            }
          }
          actualResult.push(dataObj);
        }
        //Return results in chunks for front-end pagination
        total = data.length;
        passback = actualResult.slice(start,
          Math.min(actualResult.length + 1, start + 10));
        if (!passback) return res.status(200).json({error: 0, count: 0,
          items_left: 0,
          items:[]});
        res.status(200).json({error: 0, count: Math.min(10, passback.length),
          items_left: Math.max(0, total - start - 10),
          items:passback});
      });
    });
  });

  //add a game to user's wantGames list
  app.post('/api/games/wantsgames', auth, function(req, res) {
    var gameId = req.body.id;
    var owner;
    //checks to see if game ID is valid
    Game.findById(gameId, function(err, game) {
      if (err) return res.json({error: 10, msg: 'invalid id'});
      if (game) owner = game.owner;
    });

    //find the user based on the incoming jwt token
    User.findById(req.user._id, function(err, user) {
      if (err) return res.json({error: 6, msg: 'error finding user'});
      if (user === null) return res.json({error:6, msg: 'user is null'});

      //check to see if game is already in this user's wantsgames
      var alreadyWanted = false;
      for (var i = 0; i < user.wantsGames.length; i++) {
        if (user.wantsGames[i].gameId == gameId) {
          alreadyWanted = true;
        }
      }

      //if not already wanted, add to wantsgames
      if (!alreadyWanted) {
        user.wantsGames.push({gameId: gameId, ownerId: owner});
        console.log(user.wantsGames);
        user.save(function(err) {
          if (err) return res.json({error: 1, msg: 'error saving to user wantsGames'});
          res.status(200).json({error:0}); //updated user
        });
      }
      else {
        res.json({error: 8, msg: 'game already in favorites'});
      }
    });

  });

  //remove a game from user's wantsGames list
  app.delete('/api/games/wantsgames', auth, function(req, res) {
    var gameId = req.body.id;

    //checks to see if game ID is valid
    Game.findById(gameId, function(err, game) {
      if (err) return res.json({error:10, msg:'invalid id'});
    });

    //find the user based on the incoming jwt token
    User.findById(req.user._id, function(err, user) {
      if (err) return res.json({error: 6, msg: 'error finding user'});
      if (user === null) return res.json({error: 6, msg: 'user is null'});

      //check to see if game is in this user's wantsGames
      var stillWants = true;
      for (var i = 0; i < user.wantsGames.length; i++) {
        if (user.wantsGames[i].gameId == gameId) {
          user.wantsGames.splice(i, 1);
          stillWants = false;
          break;
        }
      }

      if (!stillWants) {
        user.save(function(err) {
          if (err) return res.json({error: 1, msg: 'error saving to user wantsGames'});
          res.status(200).json({error: 0}); //updated user
        });
      } else {
        res.json({error: 9, msg: 'game not found in user list'});
      }
    });
  });

  //returns all the user's wanted games
  app.get('/api/games/mywants', auth, function(req, res) {
    var i;
    var _id = req.user._id;
    var myWants = [];

    User.findById(_id, function(err, data) {
      if (err) return res.status(400).json({error:7});
      eachAsync(data.wantsGames, function(item, index, done) {
        console.log(item, item, index);
        Game.find({_id: item.gameId}, function(errGame, dataGame) {
            if (errGame) return res.json({error:1});
            myWants.push(dataGame[0]);
            done(err);
          });
      },
      function(err) {
        if (err) return (err);
        res.status(200).json({error:0, items: myWants});
      }
      );
    });
  });

  //returns all the users's games
  app.get('/api/games/mygames', auth, function(req, res) {
    var i;
    var _id = req.user._id;
    var myGames = [];

    User.findById(_id, function(err, data) {
      if (err) return res.status(500).json({error:7});

      eachAsync(data.hasGames, function(item, index, done) {
        Game.find({_id: item}, function(errGame, dataGame) {
            if (errGame) return res.status(400).json({error:1});
            myGames.push(dataGame[0]);
            done();
          });
      },
        function(err) {
          if (err) return res.json({error:1});
          res.status(200).json({error:0,
             items: myGames});
        }
      );
    });
  });

  //add a game to user's hasGames inventory
  app.post('/api/games/hasgames', auth, function(req, res) {
    var newGame = new Game();
    newGame.owner = req.user._id;
    if (req.body.title === '' || req.body.platform === '') {
      res.status(400).json({error:11});
    }
    //create new game
    newGame.title = req.body.title;
    newGame.platform =  req.body.platform;
    newGame.condition = req.body.condition || '';
    newGame.image_urls = req.body.image_urls || [];
    newGame.short_description = req.body.short_description;
    //save game
    newGame.save(function(err, game) {
      if (err) return res.send(err);
      //find the current user & push new game's reference ID to hasGames list
      User.findById(req.user._id, function(err, user) {
        if (err) return console.log({error: 1, msg: 'error finding user'});
        if (user === null) return console.log({error: 1, msg:'user is null'});
        user.hasGames.push(game._id);
        user.save(function(err) {
          if (err) return console.log({error:1, msg: 'error saving to user hasGames'});
          console.log('success');
        });
      });
      res.status(200).json({error: 0, item: newGame});
    });
  });

  //Remove game from user's hasGames list
  app.delete('/api/games/hasgames', auth, function(req, res) {
    var gameId = req.body.id;
    Game.remove({ _id: gameId }, function(err) {
      if (err) return res.json({error:10, msg:'invalid id'});
      console.log('removed game document');
    });

    //find the user based on the incoming jwt token
    User.findById(req.user._id, function(err, user) {
      if (err) return res.json({"error":6, 'msg': 'error finding user'});
      if (user === null) return res.json({"error":6, 'msg': 'user is null'});

      //check to see if game is in this user's hasGames
      var stillHas = true;
      for (var i = 0; i < user.hasGames.length; i++) {
        if (user.hasGames[i] == gameId) {
          user.hasGames.splice(i, 1);
          stillHas = false;
          break;
        }
      }

      //delete game from other user's wants games
      User.find(
        {wantsGames: {$elemMatch: {'gameId': gameId}}}, function(err, data) {
          if (!data) return res.json({error: 1});
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].wantsGames.length; j++) {
              if (data[i].wantsGames[j].gameId == gameId) {
                data[i].wantsGames.splice(j, 1);
                break;
              }
            }
            data[i].save(function(err) {
              if (err) return res.json({'error':1, 'msg': 'error saving'});
            });
          }
          if (!stillHas) {
            user.save(function(err) {
              if (err) return res.json({error: 1, msg: 'error saving'});
              res.status(200).json({error: 0}); //updated user
            });
          } else {
            res.json({error: 9, message: 'game not found in user list'});
          }
        });
    });
  });
};
